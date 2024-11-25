import express from "express";
const router = express.Router();

import User from "../models/user.js";

router.get("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);

    res.render("applications/index.ejs", {
      applications: user.applications,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

router.get("/new", (req, res) => {
  res.render("applications/new.ejs");
});

router.get("/:applicationId/edit", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const application = user.applications.id(req.params.applicationId);

    res.render("applications/edit.ejs", {
      application: application,
    });
  } catch (error) {
    console.error(error);
    res.redirect("/");
  }
});

router.get("/:applicationId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const application = user.applications.id(req.params.applicationId);

    res.render("applications/show.ejs", {
      application: application,
    });
  } catch (error) {
    console.error(error);
    res.send("There was an error getting the application");
  }
});

router.post("/", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.applications.push(req.body);
    await user.save();

    res.redirect(`/users/${user._id}/applications`);
  } catch (error) {
    console.error(error);
    res.send("There was an error creating the form");
  }
});

router.put("/:applicationId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    const application = user.applications.id(req.params.applicationId);
    application.set(req.body);
    await user.save();

    res.redirect(
      `/users/${user._id}/applications/${req.params.applicationId}`
    );
  } catch (error) {
    console.error(error);
    res.send("There was an error updating the application");
  }
});

router.delete("/:applicationId", async (req, res) => {
  try {
    const user = await User.findById(req.session.user._id);
    user.applications.id(req.params.applicationId).deleteOne();
    user.save();

    res.redirect(`/users/${user._id}/applications`);
  } catch (error) {
    console.error(error);
    res.send("There was an error deleting the application");
  }
});

export default router;
