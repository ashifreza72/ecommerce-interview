'use client';
import { useState } from 'react';
import Link from 'next/link';
import { FaBars, FaTimes, FaUserShield } from 'react-icons/fa';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className='bg-blue-600 z-30 text-white p-4 sticky top-0 shadow-md'>
      <div className='container mx-auto flex justify-between items-center'>
        {/* Logo */}
        <Link href='/' className='text-2xl font-bold'>
          E-commerce Project
        </Link>

        {/* Desktop Menu */}
        <ul className='hidden md:flex space-x-6'>
          <li>
            <Link
              href='/admin/login'
              className='hover:text-blue-200 flex items-center'
            >
              <FaUserShield className='mr-1' /> Admin
            </Link>
          </li>
        </ul>

        {/* Mobile Menu Button */}
        <button
          className='md:hidden text-white focus:outline-none'
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className='md:hidden mt-2'>
          <ul className='flex flex-col space-y-3 p-4'>
            <li>
              <Link
                href='/'
                className='block hover:text-blue-200'
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
            </li>
            <li>
              <Link
                href='/about'
                className='block hover:text-blue-200'
                onClick={() => setIsOpen(false)}
              >
                About
              </Link>
            </li>
            <li>
              <Link
                href='/contact'
                className='block hover:text-blue-200'
                onClick={() => setIsOpen(false)}
              >
                Contact
              </Link>
            </li>
            <li>
              <Link
                href='/admin/login'
                className='block hover:text-blue-200 flex items-center'
                onClick={() => setIsOpen(false)}
              >
                <FaUserShield className='mr-1' /> Admin
              </Link>
            </li>
          </ul>
        </div>
      )}
    </nav>
  );
}
