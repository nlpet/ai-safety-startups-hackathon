import React from "react";
import { Skeleton } from "@/components/ui/skeleton";

const LoaderPlaceholder = ({ loading }) => {
  return (
    <div className="flex flex-col w-full">
      {loading.response && (
        <div className="flex flex-row w-full border-2 p-5 rounded-lg">
          <div className="flex items-center space-x-4 w-1/3">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4 w-2/3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[600px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[500px]" />
            </div>
          </div>
        </div>
      )}

      {loading.opinions && (
        <div className="flex flex-row w-full border-2 p-5 rounded-lg mt-5">
          <div className="flex items-center space-x-4 w-1/3">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4 w-2/3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[600px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[500px]" />
            </div>
          </div>
        </div>
      )}

      {loading.entities && (
        <div className="flex flex-row w-full border-2 p-5 rounded-lg mt-5">
          <div className="flex items-center space-x-4 w-1/3">
            <div className="space-y-2">
              <Skeleton className="h-8 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
              <Skeleton className="h-2 w-[275px]" />
            </div>
          </div>
          <div className="flex items-center space-x-4 w-2/3">
            <div className="space-y-2">
              <Skeleton className="h-6 w-[600px]" />
              <Skeleton className="h-4 w-[300px]" />
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[500px]" />
            </div>
          </div>
        </div>
      )}

      {loading.news && (
        <>
          <div className="flex flex-row w-full border-2 p-5 rounded-lg mt-10">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[850px]" />
                <Skeleton className="h-4 w-[850px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full border-2 p-5 rounded-lg mt-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[850px]" />
                <Skeleton className="h-4 w-[850px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full border-2 p-5 rounded-lg mt-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[850px]" />
                <Skeleton className="h-4 w-[850px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full border-2 p-5 rounded-lg mt-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[850px]" />
                <Skeleton className="h-4 w-[850px]" />
              </div>
            </div>
          </div>
          <div className="flex flex-row w-full border-2 p-5 rounded-lg mt-3">
            <div className="flex items-center space-x-4">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-[850px]" />
                <Skeleton className="h-4 w-[850px]" />
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default LoaderPlaceholder;
