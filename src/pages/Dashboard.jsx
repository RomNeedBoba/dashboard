export default function Dashboard() {
    return (
      <div className="p-8">
        <h1 className="text-2xl font-bold mb-4">Welcome to Jomnam Dashboard</h1>
        <p className="text-gray-600">
          Here you can manage your projects, teams, and monitor activity.
        </p>
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">Projects</h3>
            <p>5 active projects</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">Teams</h3>
            <p>3 teams joined</p>
          </div>
          <div className="bg-white p-6 rounded shadow">
            <h3 className="font-semibold text-lg mb-2">Total Likes</h3>
            <p>1,024 likes received</p>
          </div>
        </div>
      </div>
    );
  }
  