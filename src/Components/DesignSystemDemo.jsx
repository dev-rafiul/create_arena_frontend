import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { validateColorPalette, validateNavigationRoutes } from '../utils/designSystemValidation';
import { COLORS, NAVIGATION } from '../constants/designSystem';

const DesignSystemDemo = () => {
  const { theme, isDark } = useTheme();

  // Validate design system compliance
  const colorValidation = validateColorPalette();
  const navValidation = validateNavigationRoutes(['Home', 'Contests', 'Leaderboard'], false);
  const navValidationLoggedIn = validateNavigationRoutes(['Home', 'Contests', 'Leaderboard', 'Dashboard', 'Profile'], true);

  return (
    <div className="container-responsive py-8">
      <div className="bg-base-200 rounded-box p-6 mb-6">
        <h2 className="text-2xl font-bold text-base-content mb-4">
          Design System Status
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Theme Status */}
          <div className="bg-base-100 rounded-lg p-4 border border-base-300">
            <h3 className="font-semibold text-base-content mb-2">Current Theme</h3>
            <p className="text-sm text-neutral">
              Active: <span className="font-mono text-primary">{theme}</span>
            </p>
            <p className="text-sm text-neutral">
              Mode: <span className="font-mono">{isDark ? 'Dark' : 'Light'}</span>
            </p>
          </div>

          {/* Color Palette Validation */}
          <div className="bg-base-100 rounded-lg p-4 border border-base-300">
            <h3 className="font-semibold text-base-content mb-2">Color Palette</h3>
            <p className={`text-sm ${colorValidation.isValid ? 'text-success' : 'text-error'}`}>
              {colorValidation.isValid ? '✓ Valid' : '✗ Invalid'}
            </p>
            <p className="text-xs text-neutral">
              {colorValidation.count}/3 primary colors
            </p>
            <p className="text-xs text-neutral">
              Neutral: {colorValidation.hasNeutral ? 'Yes' : 'No'}
            </p>
          </div>

          {/* Navigation Validation */}
          <div className="bg-base-100 rounded-lg p-4 border border-base-300">
            <h3 className="font-semibold text-base-content mb-2">Navigation</h3>
            <p className={`text-sm ${navValidation.isValid ? 'text-success' : 'text-error'}`}>
              Logged Out: {navValidation.isValid ? '✓ Valid' : '✗ Invalid'}
            </p>
            <p className={`text-sm ${navValidationLoggedIn.isValid ? 'text-success' : 'text-error'}`}>
              Logged In: {navValidationLoggedIn.isValid ? '✓ Valid' : '✗ Invalid'}
            </p>
          </div>
        </div>
      </div>

      {/* Color Palette Display */}
      <div className="bg-base-200 rounded-box p-6 mb-6">
        <h3 className="text-xl font-bold text-base-content mb-4">Color Palette</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-primary rounded-lg mx-auto mb-2"></div>
            <p className="text-sm font-medium">Primary</p>
            <p className="text-xs text-neutral">Actions, CTAs</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-secondary rounded-lg mx-auto mb-2"></div>
            <p className="text-sm font-medium">Secondary</p>
            <p className="text-xs text-neutral">Success, Positive</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-accent rounded-lg mx-auto mb-2"></div>
            <p className="text-sm font-medium">Accent</p>
            <p className="text-xs text-neutral">Highlights, Warnings</p>
          </div>
          <div className="text-center">
            <div className="w-16 h-16 bg-neutral rounded-lg mx-auto mb-2"></div>
            <p className="text-sm font-medium">Neutral</p>
            <p className="text-xs text-neutral">Borders, Text</p>
          </div>
        </div>
      </div>

      {/* Component Examples */}
      <div className="bg-base-200 rounded-box p-6">
        <h3 className="text-xl font-bold text-base-content mb-4">Component Examples</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Button Examples */}
          <div className="space-y-2">
            <h4 className="font-semibold text-base-content">Buttons</h4>
            <button className="btn btn-primary w-full">Primary Button</button>
            <button className="btn btn-secondary w-full">Secondary Button</button>
            <button className="btn btn-accent w-full">Accent Button</button>
          </div>

          {/* Card Example */}
          <div className="bg-base-100 rounded-lg p-4 border border-base-300">
            <h4 className="font-semibold text-base-content mb-2">Sample Contest Card</h4>
            <div className="w-full h-24 bg-base-300 rounded mb-2"></div>
            <p className="text-sm text-neutral mb-2">Contest description goes here...</p>
            <div className="flex justify-between text-xs text-neutral mb-2">
              <span>Prize: $500</span>
              <span>Deadline: 7 days</span>
            </div>
            <button className="btn btn-primary btn-sm w-full">View Details</button>
          </div>

          {/* Form Example */}
          <div className="space-y-2">
            <h4 className="font-semibold text-base-content">Form Elements</h4>
            <input 
              type="text" 
              placeholder="Sample input" 
              className="input input-bordered w-full" 
            />
            <select className="select select-bordered w-full">
              <option>Sample select</option>
            </select>
            <textarea 
              placeholder="Sample textarea" 
              className="textarea textarea-bordered w-full"
            ></textarea>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DesignSystemDemo;