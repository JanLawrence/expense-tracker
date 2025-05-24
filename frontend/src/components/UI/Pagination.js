export default function Pagination({
    currentPage,
    totalPages,
    onPageChange,
    showFirstLast = true,
    siblingCount = 1,
    className = ''
  }) {
    // Generate page numbers to display
    const getPageNumbers = () => {
      const pageNumbers = [];
      const totalNumbers = siblingCount * 2 + 3; // siblings + current + first + last
      const totalButtons = showFirstLast ? totalNumbers + 2 : totalNumbers; // +2 for first/last buttons
      
      // Case 1: If number of pages is less than the page numbers we want to show
      if (totalPages <= totalButtons) {
        for (let i = 1; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        // Calculate left and right sibling index
        const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
        const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages);
        
        // Do not show dots when there is only one page number to be inserted
        const shouldShowLeftDots = leftSiblingIndex > 2;
        const shouldShowRightDots = rightSiblingIndex < totalPages - 1;
        
        // Case 2: No left dots to show, but rights dots to be shown
        if (!shouldShowLeftDots && shouldShowRightDots) {
          const leftItemCount = 3 + 2 * siblingCount;
          for (let i = 1; i <= leftItemCount; i++) {
            pageNumbers.push(i);
          }
          pageNumbers.push('...');
          pageNumbers.push(totalPages);
        }
        // Case 3: No right dots to show, but left dots to be shown
        else if (shouldShowLeftDots && !shouldShowRightDots) {
          pageNumbers.push(1);
          pageNumbers.push('...');
          
          const rightItemCount = 3 + 2 * siblingCount;
          for (let i = totalPages - rightItemCount + 1; i <= totalPages; i++) {
            pageNumbers.push(i);
          }
        }
        // Case 4: Both left and right dots to be shown
        else if (shouldShowLeftDots && shouldShowRightDots) {
          pageNumbers.push(1);
          pageNumbers.push('...');
          for (let i = leftSiblingIndex; i <= rightSiblingIndex; i++) {
            pageNumbers.push(i);
          }
          pageNumbers.push('...');
          pageNumbers.push(totalPages);
        }
      }
      
      return pageNumbers;
    };
    
    const pageNumbers = getPageNumbers();
    
    return (
      <nav className={`flex items-center justify-center ${className}`}>
        <ul className="flex space-x-1">
          {/* First Page Button */}
          {showFirstLast && (
            <li>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === 1
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onPageChange(1)}
                disabled={currentPage === 1}
              >
                First
              </button>
            </li>
          )}
          
          {/* Previous Page Button */}
          <li>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Prev
            </button>
          </li>
          
          {/* Page Numbers */}
          {pageNumbers.map((page, index) => (
            <li key={index}>
              {page === '...' ? (
                <span className="px-3 py-1 text-gray-500">...</span>
              ) : (
                <button
                  className={`px-3 py-1 rounded-md text-sm font-medium ${
                    currentPage === page
                      ? 'bg-primary text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                  onClick={() => onPageChange(page)}
                >
                  {page}
                </button>
              )}
            </li>
          ))}
          
          {/* Next Page Button */}
          <li>
            <button
              className={`px-3 py-1 rounded-md text-sm font-medium ${
                currentPage === totalPages
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </li>
          
          {/* Last Page Button */}
          {showFirstLast && (
            <li>
              <button
                className={`px-3 py-1 rounded-md text-sm font-medium ${
                  currentPage === totalPages
                    ? 'text-gray-400 cursor-not-allowed'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
                onClick={() => onPageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Last
              </button>
            </li>
          )}
        </ul>
      </nav>
    );
  }