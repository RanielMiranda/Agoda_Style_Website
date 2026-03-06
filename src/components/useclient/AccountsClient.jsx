"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { BUCKET_NAME } from "@/lib/utils";

const AccountsContext = createContext(null);
const ACTIVE_ACCOUNT_KEY = "active_account_v1";
const ACCOUNT_COLUMNS = [
  "id",
  "full_name",
  "email",
  "phone",
  "profile_image",
  "password",
  "role",
  "status",
  "resort_id",
  "setup_complete",
  "setup_token",
  "created_at",
  "updated_at",
  "resorts(id, name, location)",
].join(", ");

const readSessionAccount = () => {
  if (typeof window === "undefined") return null;
  try {
    const raw = sessionStorage.getItem(ACTIVE_ACCOUNT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const persistSessionAccount = (account) => {
  if (typeof window === "undefined") return;
  if (!account) {
    sessionStorage.removeItem(ACTIVE_ACCOUNT_KEY);
    return;
  }
  sessionStorage.setItem(ACTIVE_ACCOUNT_KEY, JSON.stringify(account));
};

const randomToken = () => `setup-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
const writeCookie = (name, value, maxAgeSeconds = 60 * 60 * 24 * 7) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=${encodeURIComponent(value)}; path=/; max-age=${maxAgeSeconds}; samesite=lax`;
};
const clearCookie = (name) => {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=; path=/; max-age=0; samesite=lax`;
};

const toWebpFile = async (file) => {
  if (!(file instanceof File)) return file;
  if ((file.type || "").toLowerCase() === "image/webp") return file;
  const bitmap = await createImageBitmap(file);
  const canvas = document.createElement("canvas");
  canvas.width = bitmap.width;
  canvas.height = bitmap.height;
  const ctx = canvas.getContext("2d");
  if (!ctx) return file;
  ctx.drawImage(bitmap, 0, 0);
  const blob = await new Promise((resolve) => canvas.toBlob(resolve, "image/webp", 0.82));
  if (!blob) return file;
  const base = (file.name || "profile").replace(/\.[^.]+$/, "");
  return new File([blob], `${base}.webp`, { type: "image/webp" });
};

const getStoragePathFromUrl = (url) => {
  if (!url || typeof url !== "string") return null;
  const marker = `/storage/v1/object/public/${BUCKET_NAME}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(url.slice(idx + marker.length));
};

export function AccountsProvider({ children }) {
  const [accounts, setAccounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeAccount, setActiveAccount] = useState(null);

  useEffect(() => {
    setActiveAccount(readSessionAccount());
  }, []);

  const refreshAccounts = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("accounts")
        .select(ACCOUNT_COLUMNS)
        .order("created_at", { ascending: false });
      if (error) throw error;
      setAccounts(data || []);
      return data || [];
    } finally {
      setLoading(false);
    }
  }, []);

  const createAccountInvite = useCallback(async (payload) => {
    const token = randomToken();
    const row = {
      full_name: payload.fullName || "",
      email: payload.email || "",
      phone: payload.phone || "",
      password: payload.password || "",
      role: payload.role === "admin" ? "admin" : "owner",
      status: payload.status || "pending",
      resort_id: payload.resortId ? Number(payload.resortId) : null,
      setup_complete: false,
      setup_token: token,
    };
    const { data, error } = await supabase.from("accounts").insert(row).select(ACCOUNT_COLUMNS).single();
    if (error) throw error;
    setAccounts((prev) => [data, ...prev]);
    return { account: data, setupLink: `/auth/setup-resort?token=${encodeURIComponent(token)}` };
  }, []);

  const updateAccount = useCallback(async (accountId, updates) => {
    const payload = { ...updates, updated_at: new Date().toISOString() };
    const { data, error } = await supabase
      .from("accounts")
      .update(payload)
      .eq("id", Number(accountId))
      .select(ACCOUNT_COLUMNS)
      .single();
    if (error) throw error;
    setAccounts((prev) => prev.map((entry) => (entry.id === data.id ? data : entry)));
    if (activeAccount?.id === data.id) {
      setActiveAccount(data);
      persistSessionAccount(data);
    }
    return data;
  }, [activeAccount?.id]);

  const saveAccountProfile = useCallback(
    async (accountId, updates = {}, profileFile = null, previousImageUrl = null) => {
      let nextProfileImage = updates?.profile_image || null;

      if (profileFile instanceof File) {
        const normalized = await toWebpFile(profileFile);
        const path = `accounts/${Number(accountId)}/profile-${Date.now()}.webp`;
        const { error: uploadError } = await supabase.storage.from(BUCKET_NAME).upload(path, normalized, {
          upsert: true,
          contentType: "image/webp",
        });
        if (uploadError) throw uploadError;
        const { data: uploaded } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path);
        nextProfileImage = uploaded?.publicUrl || nextProfileImage;
      }

      const saved = await updateAccount(accountId, {
        ...updates,
        profile_image: nextProfileImage,
      });

      if (profileFile instanceof File && previousImageUrl && nextProfileImage && previousImageUrl !== nextProfileImage) {
        const previousPath = getStoragePathFromUrl(previousImageUrl);
        if (previousPath) {
          await supabase.storage.from(BUCKET_NAME).remove([previousPath]);
        }
      }

      return saved;
    },
    [updateAccount]
  );

  const deleteAccount = useCallback(async (accountId) => {
    const { error } = await supabase.from("accounts").delete().eq("id", Number(accountId));
    if (error) throw error;
    setAccounts((prev) => prev.filter((entry) => entry.id !== Number(accountId)));
    if (activeAccount?.id === Number(accountId)) {
      setActiveAccount(null);
      persistSessionAccount(null);
    }
  }, [activeAccount?.id]);

  const getAccountById = useCallback(async (accountId) => {
    const { data, error } = await supabase
      .from("accounts")
      .select(ACCOUNT_COLUMNS)
      .eq("id", Number(accountId))
      .maybeSingle();
    if (error) throw error;
    return data || null;
  }, []);

  const getAccountBySetupToken = useCallback(async (token) => {
    if (!token) return null;
    const { data, error } = await supabase
      .from("accounts")
      .select(ACCOUNT_COLUMNS)
      .eq("setup_token", token)
      .maybeSingle();
    if (error) throw error;
    return data || null;
  }, []);

  const completeSetup = useCallback(async (token, updates) => {
    const account = await getAccountBySetupToken(token);
    if (!account) throw new Error("Setup token is invalid.");
    const payload = {
      ...updates,
      setup_complete: true,
      status: "active",
      updated_at: new Date().toISOString(),
    };
    const { data, error } = await supabase
      .from("accounts")
      .update(payload)
      .eq("id", account.id)
      .select(ACCOUNT_COLUMNS)
      .single();
    if (error) throw error;
    setAccounts((prev) => prev.map((entry) => (entry.id === data.id ? data : entry)));
    return data;
  }, [getAccountBySetupToken]);

  const signIn = useCallback(async (email, password) => {
    const { data, error } = await supabase
      .from("accounts")
      .select(ACCOUNT_COLUMNS)
      .eq("email", email)
      .eq("password", password)
      .maybeSingle();
    if (error) throw error;
    if (!data) throw new Error("Invalid credentials.");
    if ((data.status || "").toLowerCase() === "suspended") {
      throw new Error("This account is suspended. Contact admin for access.");
    }
    setActiveAccount(data);
    persistSessionAccount(data);
    writeCookie("app_auth", "1");
    writeCookie("app_role", data.role || "owner");
    writeCookie("app_account_id", String(data.id || ""));
    return data;
  }, []);

  const signOut = useCallback(() => {
    setActiveAccount(null);
    persistSessionAccount(null);
    clearCookie("app_auth");
    clearCookie("app_role");
    clearCookie("app_account_id");
  }, []);

  const value = useMemo(
    () => ({
      accounts,
      loading,
      activeAccount,
      refreshAccounts,
      createAccountInvite,
      updateAccount,
      saveAccountProfile,
      deleteAccount,
      getAccountById,
      getAccountBySetupToken,
      completeSetup,
      signIn,
      signOut,
    }),
    [
      accounts,
      loading,
      activeAccount,
      refreshAccounts,
      createAccountInvite,
      updateAccount,
      saveAccountProfile,
      deleteAccount,
      getAccountById,
      getAccountBySetupToken,
      completeSetup,
      signIn,
      signOut,
    ]
  );

  return <AccountsContext.Provider value={value}>{children}</AccountsContext.Provider>;
}

export const useAccounts = () => useContext(AccountsContext);
