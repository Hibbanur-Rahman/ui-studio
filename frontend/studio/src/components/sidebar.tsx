const Sidebar = () => {
  return (
    <div className="w-64 bg-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">Sidebar</h2>
      <ul>
        <li className="mb-2">
          <a href="#" className="text-gray-700 hover:text-gray-900">
            Dashboard
          </a>
        </li>
        <li className="mb-2">
          <a href="#" className="text-gray-700 hover:text-gray-900">
            Projects
          </a>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
