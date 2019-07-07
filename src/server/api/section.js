const {
  getInstructorSections,
  getSectionGrades,
  getSectionProblemsetIds,
  getSectionProblemsets,
  getStudentsInSection,
  removeUserFromSection
} = require('../db/data-access-layer/section');

const configSectionRoutes = app => {
  app.get('/api/sections', async (req, res) => {
    console.log('/api/sections');
    const { id: instructorId } = req.user;
    console.log('ID', instructorId);
    const sections = await getInstructorSections(instructorId);
    console.log('SECTIONS', sections);
    res.send(sections);
  });

  app.get('/api/sections/:sectionId/users', async (req, res) => {
    console.log('/api/sections/:sectionId/users');
    const { sectionId } = req.params;
    const students = await getStudentsInSection(sectionId);
    console.log('STUDENTS', students);
    res.send(students);
  });

  app.delete('/api/sections/:sectionId/users/:userId', async (req, res) => {
    console.log('/api/sections/:sectionId/users/:userId');
    const { sectionId, userId } = req.params;
    await removeUserFromSection(userId, sectionId);
    res.status(200).send(userId);
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
    const problemsets = await getSectionProblemsets(Number(sectionId));
    console.log('GOT THE PROBLEMSETS', problemsets);
    res.send(problemsets);
  });

  app.post(
    '/api/sections/:sectionId/problemsets/due-dates',
    async (req, res) => {
      const { sectionId } = req.params;
      console.log('/api/sections/:sectionId/problemsets/due-dates', sectionId);
      const dates = req.body;
      console.log('dates !@#&!@#&@(#&@!(#&!@))', dates);
      res.setHeader('Content-Type', 'application/json');
      res.send(dates);
    }
  );
};

module.exports = configSectionRoutes;
