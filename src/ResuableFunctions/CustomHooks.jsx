/* eslint-disable react-hooks/exhaustive-deps */
import { useLocation, useNavigate } from 'react-router-dom';
import { useDispatch as useReduxDispatch } from 'react-redux';
import { useEffect } from 'react';
import { useMemo } from 'react';
import { updateScreenCurrentDimension } from 'Views/Common/Slice/Common_slice';


//                                                   navigation hook                                                                         //
export const useCustomNavigate = () => {
  const navigate = useNavigate();

  const customNavigate = (path, options = {}) => {
    navigate(path, options);
  };
  return customNavigate;
};

//                                                    uselocation hook                                                                       //
export const CustomUseLocationHook = () => {
  const location = useLocation()
  const splitPath = location.pathname.split('/')


  return splitPath
}

//                                                     use dispatch hook                                                                     //
export const useDispatch = () => {
  const dispatch = useReduxDispatch();

  const customDispatch = (action) => {
    return dispatch(action);
  };

  return customDispatch;
};

//                                                    copyToClipboard                                                                        //
export async function copyToClipboard(textToCopy) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(textToCopy);
    }
  } catch (err) {
    console.error(err);
  }
}

//                                                      window size                                                                          //
export const useSize = () => {
  const dispatch = useReduxDispatch();

  useEffect(() => {
    const windowSizeHandler = () => {
      dispatch(updateScreenCurrentDimension(
        {
          innerHeight: window.innerHeight,
          innerWidth: window.innerWidth,
        }
      ))
    };
    
    window.addEventListener("resize", windowSizeHandler);

    return () => {
      window.removeEventListener("resize", windowSizeHandler);
    };
  }, []);

  return {
    innerHeight: window.innerHeight,
    innerWidth: window.innerWidth,
  }
};

//                                                         pagination                                                                        //
export const DOTS = '...';
const range = (start, end) => {
  let length = end - start + 1;
  return Array.from({ length }, (_, idx) => idx + start);
};

export const usePagination = ({
  totalCount,
  pageSize,
  siblingCount = 1,
  currentPage
}) => {
  const paginationRange = useMemo(() => {
    const totalPageCount = Math.ceil(totalCount / pageSize);

    // Pages count is determined as siblingCount + firstPage + lastPage + currentPage + 2*DOTS
    const totalPageNumbers = siblingCount + 5;

    /*
      If the number of pages is less than the page numbers we want to show in our
      paginationComponent, we return the range [1..totalPageCount]
    */
    if (totalPageNumbers >= totalPageCount) {
      return range(1, totalPageCount);
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1);
    const rightSiblingIndex = Math.min(
      currentPage + siblingCount,
      totalPageCount
    );

    /*
      We do not want to show dots if there is only one position left 
      after/before the left/right page count as that would lead to a change if our Pagination
      component size which we do not want
    */
    const shouldShowLeftDots = leftSiblingIndex > 2;
    const shouldShowRightDots = rightSiblingIndex < totalPageCount - 2;

    const firstPageIndex = 1;
    const lastPageIndex = totalPageCount;

    if (!shouldShowLeftDots && shouldShowRightDots) {
      let leftItemCount = 3 + 2 * siblingCount;
      let leftRange = range(1, leftItemCount);

      return [...leftRange, DOTS, totalPageCount];
    }

    if (shouldShowLeftDots && !shouldShowRightDots) {
      let rightItemCount = 3 + 2 * siblingCount;
      let rightRange = range(
        totalPageCount - rightItemCount + 1,
        totalPageCount
      );
      return [firstPageIndex, DOTS, ...rightRange];
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      let middleRange = range(leftSiblingIndex, rightSiblingIndex);
      return [firstPageIndex, DOTS, ...middleRange, DOTS, lastPageIndex];
    }
  }, [totalCount, pageSize, siblingCount, currentPage]);

  return paginationRange;
};


//                                                                Indexed db                                                                 //
export const initializeDB = (dbName, version, storeName) => {
  return new Promise((resolve, reject) => {
    const dbRequest = indexedDB.open(dbName, version);

    // Handle the database upgrade (create object stores)
    dbRequest.onupgradeneeded = (event) => {
      const db = event.target.result;

      // If the object store does not exist, create it
      if (!db.objectStoreNames.contains(storeName)) {
        db.createObjectStore(storeName, { keyPath: "id" });
      }
    };

    dbRequest.onsuccess = (event) => {
      const db = event.target.result;
      resolve(db); // Return the database instance
    };

    dbRequest.onerror = (event) => {
      reject(event.target.error); // Return the error
    };
  });
}