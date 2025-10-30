/**
 * TableSkeleton.jsx - A loading skeleton component for tables.
 */
import React from 'react';

/**
 * @function SkeletonRow
 * @summary Renders a single skeleton row for a table.
 */
const SkeletonRow = () => (
    <div className="skeleton-row d-flex gap-4 p-4">
        <div className="skeleton-cell skeleton-checkbox"></div>
        <div className="skeleton-cell skeleton-id"></div>
        <div className="skeleton-cell skeleton-email"></div>
        <div className="skeleton-cell skeleton-name"></div>
        <div className="skeleton-cell skeleton-role"></div>
        <div className="skeleton-cell skeleton-date"></div>
        <div className="skeleton-cell skeleton-actions"></div>
    </div>
);

/**
 * @function TableSkeleton
 * @summary Renders a specified number of skeleton rows to indicate loading state.
 */
const TableSkeleton = ({ rows = 10 }) => {
    return (
        <div className="skeleton-table">
            {Array.from({ length: rows }).map((_, index) => (
                <SkeletonRow key={index} />
            ))}
        </div>
    );
};

export default TableSkeleton;
