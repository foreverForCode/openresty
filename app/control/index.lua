local template = require "resty.template"
ut = require "resty.utils"
local _M = {}


function TableToStr(t)
    if t == nil then return "" end
    local retstr= "{"

    local i = 1
    for key,value in pairs(t) do
        local signal = ","
        if i==1 then
          signal = ""
        end

        if key == i then
            retstr = retstr..signal..ToStringEx(value)
        else
            if type(key)=='number' or type(key) == 'string' then
                retstr = retstr..signal..ToStringEx(key)..":"..ToStringEx(value)
            else
                if type(key)=='userdata' then
                    retstr = retstr..signal.."*s"..TableToStr(getmetatable(key)).."*e".."="..ToStringEx(value)
                else
                    retstr = retstr..signal..key..":"..ToStringEx(value)
                end
            end
        end

        i = i+1
    end

     retstr = retstr.."}"
     return retstr
end

function ToStringEx(value)
    if type(value)=='table' then
       return TableToStr(value)
    elseif type(value)=='string' then
        return "\'"..value.."\'"
    else
       return tostring(value)
    end
end



function _M.index()
   local datas = {title = "hello",num=123,child={num=3454},list={1,2,3,4,5,6,7,8,9}}
   --datas = ToStringEx(datas)
  local model = {title = "hello template" ,content = "new world",data=datas,fordata={1,2,3}}

  template.render("index.html",model)


end


local getHtmlContent = _M.index()

ngx.say(getHtmlContent)
