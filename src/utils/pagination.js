function getPaginationParams(query) {
    const page = Math.max(1, parseInt(query.page, 10) || 1);
    const limit = Math.max(1, parseInt(query.limit, 10) || 10);
    return { page, limit };
}

function paginate(items, page, limit) {
    const arr = Array.isArray(items) ? items : [];
    const total = arr.length;
    const totalPages = Math.max(1, Math.ceil(total / limit));
    const start = (page - 1) * limit;
    const paginatedItems = arr.slice(start, start + limit);

    return {
        page,
        limit,
        total,
        totalPages,
        items: paginatedItems
    };
}

module.exports = { getPaginationParams, paginate };