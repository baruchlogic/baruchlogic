const { getInstructorSections } = require('../db/data-access-layer/section');

const configSectionRoutes = app => {
  app.get('/api/sections', async (req, res) => {
    console.log('/api/sections');
    const { id: instructorId } = req.user;
    console.log("ID", instructorId);
    const sections = await getInstructorSections(instructorId);
    console.log("SECTIONS", sections);
    res.status(200).send(sections);
  });
};

module.exports = configSectionRoutes;
