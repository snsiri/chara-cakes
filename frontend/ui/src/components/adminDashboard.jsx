// import React from "react";
// // import { Card, CardContent } from "@/components/ui/card";
// // import { Button } from "@/components/ui/button";
// import { LayoutGrid, Settings, Users, FileText } from "lucide-react";
// import './adminDashboard.css';
// import Card from '@mui/material/Card';
// import CardContent from '@mui/material/CardContent';
// import CardMedia from '@mui/material/CardMedia';
// import Typography from '@mui/material/Typography';
// import Button from '@mui/material/Button';
// import CardActionArea from '@mui/material/CardActionArea';
// import CardActions from '@mui/material/CardActions';
// export default function AdminDashboard() {
//   const links = [
//     { label: "Products", icon: <LayoutGrid className="mr-2" />, href: "/admin/manage-products" },
//     { label: "Orders", icon: <Users className="mr-2" />, href: "/admin/ordertable" },
//     { label: "Customize Options", icon: <FileText className="mr-2" />, href: "/admin/update-option" },
//     { label: "Customized cakes", icon: <Settings className="mr-2" />, href: "/admin/customizes1" },
//   ];

//   return (
//     <div className="min-h-screen bg-gray-100 p-6">
//       <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
//         {links.map((link) => (
//           <Card key={link.label} className="hover:shadow-xl transition-shadow">
//             <CardContent className="flex flex-col items-start justify-center p-6">
//               <Button variant="outline" className="w-full justify-start" asChild>
//                 <a href={link.href} className="flex items-center w-full">
//                   {link.icon}
//                   {link.label}
//                 </a>
//               </Button>
//             </CardContent>
//           </Card>
//         ))}
//       </div>
//     </div>
//   );
// }
// src/App.js

import React, { useState } from 'react';

const SidebarLayout = () => {
  const [selectedItem, setSelectedItem] = useState('place-content');
  
  const sidebarItems = [
    'place-content',
    'row-gap'
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 shadow-sm">
        <div className="p-4">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Menu</h2>
          <nav className="space-y-2">
            {sidebarItems.map((item) => (
              <button
                key={item}
                onClick={() => setSelectedItem(item)}
                className={`w-full text-left px-4 py-2 rounded-lg transition-colors duration-200 ${
                  selectedItem === item
                    ? 'bg-gray-100 text-gray-900 border-l-4 border-gray-400'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                {item}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        </header>

        {/* Content */}
        <main className="flex-1 p-6 bg-pink-50">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <h2 className="text-4xl font-bold text-gray-800 mb-4">Welcome</h2>
              <p className="text-gray-600 text-lg">
                Select a property from the sidebar to see details
              </p>
              
              {/* Content based on selected item */}
              <div className="mt-8 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                  {selectedItem}
                </h3>
                <div className="text-left text-gray-700">
                  {selectedItem === 'place-content' && (
                    <div>
                      <p className="mb-3">
                        The <code className="bg-gray-200 px-2 py-1 rounded">place-content</code> property is a shorthand for setting both <code className="bg-gray-200 px-2 py-1 rounded">align-content</code> and <code className="bg-gray-200 px-2 py-1 rounded">justify-content</code> properties.
                      </p>
                      <p>
                        It defines how the browser distributes space between and around content items along both the main-axis and cross-axis of a flexbox container.
                      </p>
                    </div>
                  )}
                  {selectedItem === 'row-gap' && (
                    <div>
                      <p className="mb-3">
                        The <code className="bg-gray-200 px-2 py-1 rounded">row-gap</code> property sets the size of the gap between rows in a grid or flexbox layout.
                      </p>
                      <p>
                        It specifies the spacing between rows, helping to create consistent vertical spacing in your layout.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default SidebarLayout;
