const {
  getInstructorSections,
  getSectionGrades,
  getSectionProblemsetIds,
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

  app.get('/api/sections/:sectionId/grades', async (req, res) => {
    const { sectionId } = req.params;
    console.log('/api/sections/:sectionId/grades', sectionId);
    const grades = await getSectionGrades(Number(sectionId));
    console.log('GOT THE GRADES', grades);
    res.send(grades);
  });

  app.get('/api/sections/:sectionId/problemsets', async (req, res) => {
    const { sectionId } = req.params;
    console.log('/api/sections/:sectionId/problemsets', sectionId);
    const problemsets = await getSectionProblemsetIds(Number(sectionId));
    console.log('GOT THE PROBLEMSETS', problemsets);
    res.send(problemsets);
  });
};

module.exports = configSectionRoutes;
