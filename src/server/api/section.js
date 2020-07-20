const {
  addProblemsetToSection,
  addStudentGrade,
  getInstructorSections,
  getSectionGrades,
  // getSectionProblemsetIds,
  getSectionProblemsets,
  getStudentsInSection,
  getUserIdFromKey,
  removeUserFromSection,
  updateProblemsetDueDate,
  deleteProblemsetFromSection,
  updateStudentGrade
} = require('../db/data-access-layer/section');

const configSectionRoutes = app => {
  // Get all sections for an instructor.
  app.get('/api/sections', async (req, res) => {
    const { id: instructorId } = req.user;
    const sections = await getInstructorSections(instructorId);
    res.send(sections);
  });

  // Get all students in a section.
  app.get('/api/sections/:sectionId/users', async (req, res) => {
    const { sectionId } = req.params;
    const students = await getStudentsInSection(sectionId);
    res.send(students);
  });

  // Remove a user from a section.
  app.delete('/api/sections/:sectionId/users/:userId', async (req, res) => {
    const { sectionId, userId } = req.params;
    await removeUserFromSection(userId, sectionId);
    res.status(200).send(userId);
  });

  // Get students' grades for a section.
  app.get('/api/sections/:sectionId/grades', async (req, res) => {
    const { sectionId } = req.params;
    const grades = await getSectionGrades(Number(sectionId));
    res.send(grades);
  });

  // Set student's grade for a problemset.
  app.post(
    '/api/sections/:sectionId/grades/:problemsetId/:studentId',
    async (req, res) => {
      const {
        params: { problemsetId, sectionId, studentId },
        body: { score }
      } = req;
      console.log(problemsetId, sectionId, studentId, score);
      // const { problemsetId, sectionId } = req.params;
      // const { id: studentId } = req.user;
      // const { body: score } = request;
      const grades = await getSectionGrades(Number(sectionId));
      const studentHasGradeForProblemset =
        grades[studentId][problemsetId] !== undefined;
      const id = await getUserIdFromKey(studentId);
      if (studentHasGradeForProblemset) {
        await updateStudentGrade(id, problemsetId, score);
      } else {
        await addStudentGrade(id, problemsetId, score);
      }
      res.sendStatus(200);
    }
  );

  // Get the problemsets for a section.
  app.get('/api/sections/:sectionId/problemsets', async (req, res) => {
    const { sectionId } = req.params;
    const problemsets = await getSectionProblemsets(Number(sectionId));
    res.send(problemsets);
  });

  // Get the problemsets for a section with logged in user.
  app.get('/api/user/sections/problemsets', async (req, res) => {
    const { section_id: sectionId } = req.user;
    console.log('SECTIONID!!!', sectionId);
    const problemsets = await getSectionProblemsets(Number(sectionId));
    res.send(problemsets);
  });

  // Gets the due-dates for a section.
  // TODO: FIX
  app.get(
    '/api/sections/:sectionId/problemsets/due-dates',
    async (req, res) => {
      // const { sectionId } = req.params;
      const dates = req.body;
      res.setHeader('Content-Type', 'application/json');
      res.send(dates);
    }
  );

  // Sets the due dates for a problemset.
  app.post(
    '/api/sections/:sectionId/problemsets/due-dates/:problemsetId',
    async (req, res) => {
      const { problemsetId, sectionId } = req.params;
      const { date } = req.body;
      await updateProblemsetDueDate({ problemsetId, sectionId, date });
      res.setHeader('Content-Type', 'application/json');
      res.send(date);
    }
  );

  // Delete a problemset from a section
  app.delete(
    '/api/sections/:sectionId/problemsets/:problemsetId',
    async (req, res) => {
      const { problemsetId, sectionId } = req.params;
      await deleteProblemsetFromSection(problemsetId, sectionId);
      res.sendStatus(200);
    }
  );

  // Add a problemset to a section
  app.post(
    '/api/sections/:sectionId/problemsets/:problemsetId',
    async (req, res) => {
      const { problemsetId, sectionId } = req.params;
      await addProblemsetToSection(problemsetId, sectionId);
      res.sendStatus(200);
    }
  );
};

module.exports = configSectionRoutes;
