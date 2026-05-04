'use client';
import { useState, useEffect, useRef } from 'react';
import { fetchWithAuth } from '../lib/api';
import { Search, UserPlus, X } from 'lucide-react';

export default function UserSearch({ onSelect, placeholder = "Search by name or email..." }) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length > 1) {
        setIsLoading(true);
        try {
          const data = await fetchWithAuth(`/auth/users/search?q=${query}`);
          setSuggestions(data);
          setIsOpen(true);
        } catch (err) {
          console.error('Search failed:', err);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (user) => {
    onSelect(user);
    setQuery('');
    setSuggestions([]);
    setIsOpen(false);
  };

  return (
    <div className="relative w-full" ref={wrapperRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-500" />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 bg-gray-900 border border-gray-700 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all placeholder-gray-500 text-gray-100"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <X className="h-4 w-4 text-gray-500 hover:text-gray-300" />
          </button>
        )}
      </div>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-gray-800 border border-gray-700 rounded-xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-1 duration-200">
          {isLoading ? (
            <div className="p-4 text-center text-gray-400">
              <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-2"></div>
              Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-60 overflow-y-auto custom-scrollbar">
              {suggestions.map((user) => (
                <li
                  key={user._id}
                  onClick={() => handleSelect(user)}
                  className="flex items-center justify-between p-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-0"
                >
                  <div className="flex flex-col">
                    <span className="font-bold text-gray-100">{user.name}</span>
                    <span className="text-xs text-gray-400">{user.email}</span>
                  </div>
                  <UserPlus className="h-4 w-4 text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-4 text-center text-gray-500">No users found</div>
          )}
        </div>
      )}
    </div>
  );
}
