local template = require "resty.template"
local _M = {}

function _M.index()
  
  template.render("real.html",model)
  return "";

end


local getHtmlContent = _M.index()

ngx.say(getHtmlContent)
