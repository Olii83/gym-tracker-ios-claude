import React from 'react';

interface SettingsItemProps {
  icon: React.ReactNode;
  label: string;
  description?: string;
  action: React.ReactNode;
}

const SettingsItem = ({ icon, label, description, action }: SettingsItemProps) => {
  return (
    <div className="bg-gray-100 dark:bg-gray-900 p-4 flex justify-between items-center">
      <div className="flex items-center space-x-4">
        {icon}
        <div>
          <span className="font-medium text-gray-900 dark:text-white">{label}</span>
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{description}</p>
          )}
        </div>
      </div>
      <div>{action}</div>
    </div>
  );
};

export default SettingsItem;
