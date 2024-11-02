"use client"
import clsx from 'clsx';
import * as React from 'react';
import useContentMeta from '@/hooks/useContentMeta';

export default function LikeButton({ slug }: { slug: string }) {
  // const { isLoading, contentLikes } = useContentMeta(slug);
  const [likesByUser, setLikesByUser] = React.useState<number>(0); // Local state for likes
  const [hasLiked, setHasLiked] = React.useState<boolean>(false); // Track if the user has liked

  const addLike = () => {
    if (!hasLiked) {
      setLikesByUser(prev => prev + 1);
      setHasLiked(true); // Mark as liked
    } else {
      setLikesByUser(prev => prev - 1);
      setHasLiked(false); // Mark as unliked
    }
  };

  return (
    <div className='flex items-center space-x-4'>
      {true ? (
        <div className='animate-pulse text-gray-500'>
          <svg
            stroke='currentColor'
            fill='currentColor'
            strokeWidth={0}
            className='h-12 w-12'
            viewBox='0 0 512 512'
          >
            <path d='M139.625 23.563c-1.58.008-3.147.052-4.72.125l171.75 258.093h146.25c15.35-16.906 27.875-35.263 35.69-56.56h-96.876c-7.317 18.17-25.136 31.093-45.845 31.093-27.173 0-49.375-22.233-49.375-49.407 0-11.436 3.95-21.978 10.53-30.375l-49.155-77.655c-.03.053-.063.103-.094.156-1.183-2.05-2.395-4.036-3.624-6-30.106-48.086-73.28-69.694-114.53-69.468zm228.656 2.656c-35.864.328-72.648 18.056-100.78 57.655h204.125C447.147 47.133 408.293 25.85 368.28 26.22zm-253.967.25c-11.495 2.624-22.58 7.007-32.876 13 10.672 9.08 17.47 22.6 17.47 37.624 0 12.72-4.873 24.35-12.844 33.125l43.187 67.31h85.594L114.314 26.47zM49.5 46.374c-17.074 0-30.72 13.645-30.72 30.72 0 17.073 13.646 30.686 30.72 30.686 17.074 0 30.72-13.612 30.72-30.686 0-17.074-13.646-30.72-30.72-30.72zm232.844 56.188l38.97 61.53c7.24-4.184 15.635-6.593 24.56-6.593 27.05 0 49.203 22.03 49.407 49.03h98.75c2.575-11.807 3.757-24.49 3.345-38.25-.735-24.555-6.237-46.66-15.22-65.718h-199.81zm-259.47 16.062c-4.02 15.02-5.985 31.62-5.436 49.656.095 3.143.293 6.215.562 9.25h89.063l-35.97-56.06c-6.533 3.197-13.86 5-21.593 5-9.79 0-18.926-2.887-26.625-7.845zm323 57.563c-17.073 0-30.687 13.644-30.687 30.718 0 17.074 13.614 30.72 30.688 30.72 17.074 0 30.72-13.646 30.72-30.72 0-17.074-13.646-30.72-30.72-30.72zm-325.03 20.03c3.693 16.938 10.187 32.203 18.75 46.345H196.562l2.75 4.343L276.97 369.53l9.092 14.345H212.22c-1.403 6.96-4.274 13.418-8.282 19 22.164 24.562 41.335 52.573 53.843 86.75 35.156-90.944 118.132-134.872 176.564-189.156h-137.72l-2.78-4.19-66.594-100.06H20.844zM52.5 261.25c21.193 27.23 49.796 50.764 79.313 75.313 8.633-7.354 19.808-11.813 31.968-11.813 24.116 0 44.348 17.504 48.595 40.438h39.72L186.28 261.25H52.5zm111.28 82.188c-17.073 0-30.718 13.644-30.718 30.718 0 17.074 13.645 30.72 30.72 30.72 17.073 0 30.687-13.646 30.687-30.72 0-17.074-13.615-30.72-30.69-30.72z' />
          </svg>
        </div>
      ) : (
        <button
          className='heart-button rounded-md focus:outline-none'
          onClick={addLike}
        >
           <LikeButtonHeart likes={likesByUser} />
        </button>
      )}

      {/* Like counter text */}
      <div
        className={clsx(
          'mt-1 text-lg font-medium',
          likesByUser === 0
            ? 'text-gray-400 dark:text-gray-500'
            : 'bg-primary-300/50 transition-colors dark:bg-gradient-to-tr dark:from-primary-300 dark:to-primary-400 dark:bg-clip-text dark:text-transparent'
        )}
      >
        {false ? <span>...</span> : <span>{1 + likesByUser}</span>}
      </div>
    </div>
  );
}

export const HEART_PATH_SVG = '...'; // Keep your existing SVG path here
export const HEART_PATH = '...'; // Keep your existing heart path here

function LikeButtonHeart({ likes }: { likes: number }) {
  return (
    <div className='relative'>
      <div className='absolute w-full text-center text-2xl'>
        <div
          className={clsx(
            'absolute w-full opacity-0',
            likes === 5 && 'emoji-animate'
          )}
        >
          🥳
        </div>
      </div>

      {/* Heart SVG */}
      <svg
        viewBox='0 0 20 20'
        className='heart-animate w-12'
        // Grow heart from center
        style={{ transformOrigin: '50% 50%' }}
      >
        <defs>
          {/* Gradient definition */}
          <linearGradient id='gradient' x1='0%' y1='0%' x2='0%' y2='100%'>
            <stop
              offset='0%'
              style={{ stopColor: 'currentColor', stopOpacity: 1 }}
              className='text-primary-300 dark:text-primary-200'
            />
            <stop
              offset='50%'
              style={{ stopColor: 'currentColor', stopOpacity: 1 }}
              className='text-primary-400 dark:text-primary-300'
            />
            <stop
              offset='100%'
              style={{ stopColor: 'currentColor', stopOpacity: 1 }}
              className='text-primary-500 dark:text-primary-400'
            />
          </linearGradient>

          <clipPath
            id='clip-path'
            transform='scale(19,19)'
            clipPathUnits='userOnSpace'
          >
            <path d={HEART_PATH} />
          </clipPath>
        </defs>

        <g clipPath='url(#clip-path)'>
          <rect
            width={20}
            height={20}
            fill='currentColor'
            className={clsx(
              'dark:text-gray-600',
              likes === 5 ? 'text-white' : 'text-gray-400'
            )}
          />

          {/* Heart gradient fill */}
          <rect
            fill='url(#gradient)'
            width={20}
            height={20}
            x={0}
            y={0}
            style={{
              transform: `translateY(${20 - likes * 4}px)`,
              transition:
                'transform 150ms cubic-bezier(0.64, 0.57, 0.67, 1.53)',
            }}
          />
        </g>
      </svg>
    </div>
  );
}