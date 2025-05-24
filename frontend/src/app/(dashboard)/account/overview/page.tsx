"use client";

import { useEffect, useState } from "react";
import Card from '@/components/UI/Card';
import PageHeader from '@/components/Standard/PageHeader'
import Avatar from "@/components/UI/Avatar/Avatar";
import Button from "@/components/UI/Button";
import OffCanvas from '@/components/UI/OffCanvas';

import Link from 'next/link';

import { getUserInitials } from '@/services/Helpers'
import { useAuthContext } from '@/context/AuthContext';


export default function OverviewPage() {

  const { user } = useAuthContext();
  const [isOpen, setIsOpen] = useState(false);
  const userName = user ? `${user.firstName} ${user.lastName}` : ''
  
  const breadcrumb = [
    {
      'label': 'Dashboard',
      'href': '/dashboard' 
    },
    {
      'label': 'Account',
      'href': '', 
      'disabled': true
    },
    {
      'label': 'Overview',
      'href': '/account/overview',
    },
  ]
  return (
    <>
      <PageHeader breadcrumb={breadcrumb} title={'Account Overview'}/>

      <Card noPadding={true} className="px-6 py-6 mb-5">
        <div className={`flex justify-start items-center`}>
          <Avatar 
            src={null} 
            alt={userName}
            initials={getUserInitials(userName)}
            size="xxl"
          />
          <div className="ml-5">
            <span className="text-2xl font-semibold">{userName}</span>
          </div>
        </div>
        {/* <div className={`flex border-b border-gray-200`}>
          <Link
            href={'/account/overview'}
            className={`px-4 py-2 text-sm font-medium transition-colors text-primary-500 border-b-2 border-primary-500 cursor-pointer`}
            role="tab"
          >
            Overview  
          </Link>
          <Link
            href={'/account/settings'}
            className={`px-4 py-2 text-sm font-medium transition-colors cursor-pointer`}
            role="tab"
          >
            Settings  
          </Link>
        </div> */}
      </Card>
      <Card 
        title={'Profile Details'}
        className="mb-5"
        actions={
         <Button  onClick={() => setIsOpen(true)}>
            Edit Profile
          </Button>
        }
      >
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-full md:w-1/3">
              <h4 className="text-gray-500 font-medium">Full Name</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{userName}</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Email Address</h4>
              {/* <div className="ml-2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">i</span>
              </div> */}
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0 flex items-center">
              <p className="text-gray-800 font-medium md:text-md">{user?.email}</p>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-200 text-lime-800">
                Verified
              </span>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Contact Phone</h4>
              {/* <div className="ml-2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500 text-xs">i</span>
              </div> */}
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0 flex items-center">
              <p className="text-gray-800 font-medium md:text-md">{'09228643312'}</p>
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-lime-200 text-lime-800">
                Verified
              </span>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Country</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">Pelepens</p>
            </div>
          </div>
          
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3">
              <h4 className="text-gray-500 font-medium">Communication</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">Email, Phone</p>
            </div>
          </div>
        </div>
      </Card>
      <Card 
        className="mb-5"
        title={'Setup Details'}
      >
        <div className="space-y-3">
          <div className="flex flex-col md:flex-row md:items-center">
            <div className="w-full md:w-1/3">
              <h4 className="text-gray-500 font-medium">Starting Money</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{'₱ 10,000.00'}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Pay Schedule</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{'Monthly'}</p>
            </div>
          </div>
          <div className="flex flex-col md:flex-row md:items-center pt-3 border-t border-gray-100">
            <div className="w-full md:w-1/3 flex items-center">
              <h4 className="text-gray-500 font-medium">Income per Monthly Period</h4>
            </div>
            <div className="w-full md:w-2/3 mt-1 md:mt-0">
              <p className="text-gray-800 font-medium md:text-md">{'₱ 20,000.00'}</p>
            </div>
          </div>
        </div>
      </Card>

      <OffCanvas
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        title="Edit Profile"
        position="right"
        size="xl"
      >
        <div className="space-y-4">
          <p>This panel should slide in smoothly from the right.</p>
          <Button onClick={() => setIsOpen(false)}>
            Close Panel
          </Button>
        </div>
      </OffCanvas>
    </>
  );
}