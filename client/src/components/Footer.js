export default function Footer() {
  return (
    <footer className='fixed bottom-0 left-0 z-20 w-full p-2 border-t border-violet-200 shadow bg-gray-800 h-12 bg-gradient-to-r from-violet-800 to-white-700'>
      <div className='max-w-5xl mx-auto px-2 md:px-4'>
        <div className='flex flex-col md:flex-row justify-between items-center'>
          <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400 mb-2 md:mb-0'>
            © 2023{" "}
            <a
              href='http://localhost:3000/Home/'
              className='custom-link hover:underline'
            >
              eHealth™
            </a>
            . All Rights Reserved.
          </span>

          <ul className='flex mt-2 text-sm items-center font-medium text-gray-500 dark:text-gray-400'>
            <li className='mr-4'>
              <i class='bi bi-twitter'></i>
            </li>
            <li className='mr-4'>
              <i class='bi bi-facebook'></i>
            </li>
            <li>
              <a
                href='https://github.com/Tea27'
                className='custom-link hover:underline'
              >
                <i className='bi bi-github'></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
