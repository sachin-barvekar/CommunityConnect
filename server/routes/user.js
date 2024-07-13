const express = require("express");
const router = express.Router();

const {signup, login } = require("../controller/Auth");
const {getProfile} = require("../controller/Users");
const { auth, isCommunityOrganization, isCommunityBusinessOrOrganization} = require('../middleware/auth');
const {createEvent,getAllEvents,getEventById,updateEventById,deleteEventById} = require("../controller/Event");
const {createProject, getAllProjects, getProjectById, updateProjectById, deleteProjectById } = require("../controller/Project");
const {createNews, getAllNews, getNewsById, updateNewsById, deleteNewsById } = require("../controller/News");
const {createVolunteerOpportunity, getAllVolunteerOpportunities,getVolunteerOpportunityById,updateVolunteerOpportunityById,deleteVolunteerOpportunityById } = require("../controller/Volunteer");
const {Signout} = require("../controller/Signout");

//routes mapping
//Profile page routes
router.get('/user', auth, getProfile);
router.post("/user/signup", signup);
router.post("/user/login", login);

//Events page route
router.post("/events", auth, createEvent);
router.get("/events", auth, getAllEvents);
router.get("/eventsbyuser", auth, getEventById);
router.put("/events/:id", auth, updateEventById);
router.delete("/events/:id",auth, deleteEventById);

//News page route
router.post("/news", auth, createNews);
router.get("/news", auth, getAllNews);
router.get("/newsbyuser", auth, getNewsById);
router.put("/news/:id", auth, updateNewsById);
router.delete("/news/:id", auth, deleteNewsById);

// Project routes
router.post('/projects', auth,  isCommunityBusinessOrOrganization, createProject);
router.get('/projects', auth, getAllProjects);
router.get('/projectsbyuser', auth, getProjectById);
router.put('/projects/:id', auth, isCommunityBusinessOrOrganization, updateProjectById);
router.delete('/projects/:id', auth, isCommunityBusinessOrOrganization, deleteProjectById);

// //Voluteer page route
router.post("/volunteers",auth, isCommunityOrganization, createVolunteerOpportunity);
router.get("/volunteers", auth, getAllVolunteerOpportunities);
router.get("/volunteersbyuser",auth, getVolunteerOpportunityById);
router.put("/volunteers/:id", auth, isCommunityOrganization, updateVolunteerOpportunityById);
router.delete("/volunteers/:id",auth, isCommunityOrganization, deleteVolunteerOpportunityById);

router.post('/signout', Signout);

module.exports = router;