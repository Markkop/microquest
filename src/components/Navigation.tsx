import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Plus, BarChart2, Settings } from 'lucide-react';
import { useTranslation } from 'react-i18next';

const Navigation: React.FC = () => {
  const { t } = useTranslation();
  
  return (
    <motion.nav 
      className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg"
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      transition={{ delay: 0.2, duration: 0.3 }}
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-around items-center h-16">
          <NavItem to="/" icon={<Home size={24} />} label={t('navigation.home')} />
          <NavItem to="/add" icon={<Plus size={24} />} label={t('navigation.add')} />
          <NavItem to="/stats" icon={<BarChart2 size={24} />} label={t('navigation.stats')} />
          <NavItem to="/settings" icon={<Settings size={24} />} label={t('navigation.settings')} />
        </div>
      </div>
    </motion.nav>
  );
};

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) => 
        `flex flex-col items-center justify-center px-4 py-2 text-sm rounded-lg transition duration-150 ease-in-out
        ${isActive 
          ? 'text-primary-700 font-medium' 
          : 'text-gray-500 hover:text-primary-600'
        }`
      }
    >
      {({ isActive }) => (
        <motion.div 
          className="flex flex-col items-center"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="mb-1">
            {React.cloneElement(icon as React.ReactElement, { 
              className: isActive ? 'text-primary-700' : '' 
            })}
          </div>
          <span>{label}</span>
        </motion.div>
      )}
    </NavLink>
  );
};

export default Navigation;