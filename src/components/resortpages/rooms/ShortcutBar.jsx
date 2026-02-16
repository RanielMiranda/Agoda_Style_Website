import { HashLink } from "react-router-hash-link";

export default function ShortcutBar() {
  return (
    <div className="bg-white border-b mt-6">
      <div className="max-w-6xl mx-auto px-4 py-3 flex gap-6 text-sm font-medium text-gray-600">
        <button className="hover:text-blue-600 flex justify-items-center items-center">Overview</button>

        <HashLink smooth to="#amenities" className="hover:text-blue-600 flex justify-items-center items-center">
          Amenities
        </HashLink>

        <HashLink smooth to ='#extra-services' className="hover:text-blue-600 flex justify-items-center items-center">
          Additional Services
        </HashLink>

        <HashLink smooth to="#rooms" className="hover:text-blue-600 flex justify-items-center items-center">
          Available Rooms
        </HashLink>
      </div>
    </div>
  );
}
