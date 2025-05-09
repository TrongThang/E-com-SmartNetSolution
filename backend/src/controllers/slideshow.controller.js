const {
    getSlideshowService,
    getSlideshowDetailService,
    createSlideshowService,
    updateSlideshowService,
    deleteSlideshowService
} = require('../services/slideshow_service');

class SlideshowController {
    async getSlideshow(req, res) {
        const { filter = null, limit = null, sort = null, order = null } = req.body || {};
        const response = await getSlideshowService(filter, limit, sort, order);
        return res.status(response.status_code).json(response);
    }

    async getSlideshowDetail(req, res) {
        const { id } = req.params;
        const response = await getSlideshowDetailService(id);
        return res.status(response.status_code).json(response);
    }

    async createSlideshow(req, res) {
        const { text_button, link, image, status } = req.body;
        const response = await createSlideshowService({ text_button, link, image, status });
        return res.status(response.status_code).json(response);
    }

    async updateSlideshow(req, res) {
        const { id, text_button, link, image, status } = req.body;
        const response = await updateSlideshowService({ id: Number(id), text_button, link, image, status });
        return res.status(response.status_code).json(response);
    }

    async deleteSlideshow(req, res) {
        const { id } = req.params;
        const response = await deleteSlideshowService(Number(id));
        return res.status(response.status_code).json(response);
    }
}

module.exports = new SlideshowController();