import Resource from '../models/Resource.js';

// @desc    Get all agricultural resources/products with filter & search
// @route   GET /api/resources
// @access  Public
export const getResources = async (req, res, next) => {
  try {
    const { category, search, isOrganic } = req.query;
    const query = { isAvailable: true };

    if (category && category !== 'all') {
      query.category = category;
    }

    if (isOrganic === 'true') {
      query.isOrganic = true;
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { manufacturer: { $regex: search, $options: 'i' } },
      ];
    }

    const resources = await Resource.find(query).sort({ rating: -1, createdAt: -1 });
    res.json({ success: true, count: resources.length, data: resources });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single resource by ID
// @route   GET /api/resources/:id
// @access  Public
export const getResourceById = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new resource (Admin only)
// @route   POST /api/resources
// @access  Private/Admin
export const createResource = async (req, res, next) => {
  try {
    const resource = await Resource.create(req.body);
    res.status(201).json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Update resource (Admin only)
// @route   PUT /api/resources/:id
// @access  Private/Admin
export const updateResource = async (req, res, next) => {
  try {
    const resource = await Resource.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ success: true, data: resource });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete resource (Admin only)
// @route   DELETE /api/resources/:id
// @access  Private/Admin
export const deleteResource = async (req, res, next) => {
  try {
    const resource = await Resource.findById(req.params.id);
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    await resource.deleteOne();
    res.json({ success: true, message: 'Resource deleted successfully' });
  } catch (error) {
    next(error);
  }
};
