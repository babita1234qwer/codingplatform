import React, { useState } from 'react';
import { Plus, Edit, Trash2, Video, CalendarPlus } from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Admin() {
  const [selectedOption, setSelectedOption] = useState(null);

  const adminOptions = [
    {
      id: 'create',
      title: 'Create Problem',
      description: 'Add a new coding problem to the platform',
      icon: Plus,
      color: 'btn-neutral',
      bgColor: 'bg-neutral/20',
      route: '/admin/create'
    },
    {
      id: 'update',
      title: 'Update Problem',
      description: 'Edit existing problems and their details',
      icon: Edit,
      color: 'btn-warning',
      bgColor: 'bg-warning/20',
      route: '/admin/problems'
    },
    {
      id: 'delete',
      title: 'Delete Problem',
      description: 'Remove problems from the platform',
      icon: Trash2,
      color: 'btn-error',
      bgColor: 'bg-error/20',
      route: '/admin/delete'
    },
    {
      id: 'video',
      title: 'Video Problem',
      description: 'Upload And Delete Videos',
      icon: Video,
      color: 'btn-success',
      bgColor: 'bg-success/20',
      route: '/admin/video'
    },
    {
      id: 'contest',
      title: 'Create Contest',
      description: 'Schedule a coding contest with selected problems',
      icon: CalendarPlus,
      color: 'btn-primary',
      bgColor: 'bg-primary/20',
      route: '/admins/createcontest'
    }
  ];

  return (
    <div className="min-h-screen bg-[#0f172a] text-white">
      <div className="container mx-auto px-6 py-12">

        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-2">Admin Panel</h1>
          <p className="text-gray-400 text-lg">Manage coding problems and contests</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {adminOptions.map((option) => {
            const IconComponent = option.icon;
            return (
              <div
                key={option.id}
                className="card bg-[#1e293b] border border-gray-700 shadow-md hover:shadow-lg transition duration-300 hover:scale-[1.02] rounded-xl"
              >
                <div className="card-body items-center text-center p-6">
                  
                  <div className={`${option.bgColor} p-4 rounded-full mb-4`}>
                    <IconComponent size={36} className="text-white" />
                  </div>
                  
                  <h2 className="text-xl font-semibold mb-2">{option.title}</h2>
                  <p className="text-gray-400 text-sm mb-6">{option.description}</p>
                  
                  <NavLink 
                    to={option.route}
                    className={`btn ${option.color} w-full`}
                  >
                    {option.title}
                  </NavLink>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
}

export default Admin;

