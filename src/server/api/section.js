const {
  getInstructorSections,
  getStudentsInSection
} = require('../db/data-access-layer/section');

const configSectionRoutes = app => {
  app.get('/api/sections', async (req, res) => {
    console.log('/api/sections');
    const { id: instructorId } = req.user;
    console.log('ID', instructorId);
    const sections = await getInstructorSections(instructorId);
    console.log('SECTIONS', sections);
    res.status(200).send(sections);
  });

  app.get('/api/sections/:sectionId/roster', async (req, res) => {
    console.log('/api/sections/:sectionId/roster');
    const { sectionId } = req.params;
    const students = await getStudentsInSection(sectionId);
    console.log('STUDENTS', students);
    res.status(200).send(students);
  });
};

module.exports = configSectionRoutes;
