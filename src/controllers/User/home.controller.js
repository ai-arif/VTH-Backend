import Content from "../../models/content.model.js";
import Logo from "../../models/logo.model.js";
import sendResponse from "../../utils/sendResponse.js";

import { AsyncHandler } from "../../utils/AsyncHandler.js";

// get home page content
export const getHomeContent = AsyncHandler(async (req, res) => {
  try {
    const content = await Content.findOne({
      enable: true,
    });
    const logos = await Logo.find();
    return sendResponse(res, 200, true, "Content fetched successfully", {
      content,
      logos,
    });
  } catch (error) {
    return sendResponse(res, 500, false, error.message);
  }
});
