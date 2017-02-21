import axios from 'axios';
let server = 'http://101.201.28.235:82/';
// let server = 'http://localhost:63787/';
let base = server + 'api/account';

export const requestLogin = params => {
    return axios.post(`${base}/login`, params).then(res => res.data).catch(err => {
        console.log(err)
        return { msg: '网络出错', code: 500 }
    });
};
export const requestRegister = params => { return axios.post(`${base}/register`, params).then(res => res.data); };
export const updateUser = params => { return axios.post(`${base}/update`, params).then(res => res.data); };
export const deleteUser = params => { return axios.post(`${base}/delete`, params).then(res => res.data); };
export const getUserList = params => {
    return axios.post(`${base}/getList`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const getRoleList = params => {
    return axios.post(`${base}/getRoleList`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const getRouteList = params => {
    return axios.post(`${base}/getRouteList`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const addRoute = params => {
    return axios.post(`${base}/addRoute`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const updateRoute = params => {
    return axios.post(`${base}/updateRoute`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const deleteRoute = params => {
    return axios.post(`${base}/deleteRoute`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const getRouteByRoleId = params => {
    return axios.get(`${base}/getRouteByRoleId/?roleId=${params.roleId}`).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};

export const addRole = params => {
    return axios.post(`${base}/addRole`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const updateRole = params => {
    return axios.post(`${base}/updateRole`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
export const deleteRole = params => {
    return axios.post(`${base}/deleteRole`, params).then(res => res.data).catch(err => {
        return { msg: '网络出错', code: 500 }
    });
};
//文件上传
let base1 = server + 'api/commission';
export const commitData = params => {
    return axios.post(`${base1}/SaveData`, params).then(res => res.data).catch(err => {
        return { msg: '保存数据出错', code: 500 }
    });
};
export const GetCommissions = params => {
    return axios.post(`${base1}/GetCommissions`, params).then(res => res.data);
};
export const DelCommissions = params => {
    return axios.post(`${base1}/DeleteCommission`, params).then(res => res.data).catch(err => {
        return false;
    });
};
//local store
const USER_KEY = 'user';
export const fetchUser = () => {
    let userStr = JSON.parse(localStorage.getItem(USER_KEY)) || '';
    return userStr || { name: '', password: '' };
}
export const formatDate = (d) => {
    let date = new Date(d);
    let Y = date.getFullYear() + '-';
    let M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
    let D = date.getDate() < 10 ? '0' + date.getDate() : date.getDate();
    return (Y + M + D);
}
//json to csv
export const JSONToCSVConvertor = (JSONData, ReportTitle, ShowLabel) => {
    //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData;
    var CSV = '';
    //Set Report title in first row or line
    CSV += ReportTitle + '\r\n\n';
    //This condition will generate the Label/Header
    if (ShowLabel) {
        var row = "";
        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
            //Now convert each value to string and comma-seprated
            row += index + ',';
        }
        row = row.slice(0, -1);
        //append Label row with line break
        CSV += row + '\r\n';
    }
    //1st loop is to extract each row
    for (var i = 0; i < arrData.length; i++) {
        var row = "";
        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
            row += '"' + arrData[i][index] + '",';
        }
        row.slice(0, row.length - 1);
        //add a line break after each row
        CSV += row + '\r\n';
    }

    if (CSV == '') {
        alert("Invalid data");
        return;
    }

    //Generate a file name
    var fileName = "MyReport_";
    //this will remove the blank-spaces from the title and replace it with an underscore
    fileName += ReportTitle.replace(/ /g, "_");

    //Initialize file format you want csv or xls
    var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);

    // Now the little tricky part.
    // you can use either>> window.open(uri);
    // but this will not work in some browsers
    // or you will not get the correct file extension    

    //this trick will generate a temp <a /> tag
    var link = document.createElement("a");
    link.href = uri;

    //set the visibility hidden so it will not effect on your web-layout
    link.style = "visibility:hidden";
    link.download = fileName + ".csv";

    //this part will append the anchor tag and remove it after automatic click
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
//json to excel
export const JSONToExcelConvertor = (JSONData, FileName, ShowLabel) => {
    //先转化json
    var arrData = typeof JSONData != 'object' ? JSON.parse(JSONData) : JSONData; var excel = '<table>';
    //生成表头 
    var row = "<tr>"; for (var i = 0; i < ShowLabel.length; i++) { row += "<td>" + ShowLabel[i] + '</td>'; } excel += row + "</tr>";
    //循环生成表身 
    for (var i = 0; i < arrData.length; i++) {
        var row = "<tr>";
        // for (var j in arrData[i]) {
        //     // var name = arrData[i][index].name === "." ? "" : arrData[i][index].name; 
        //     var td = arrData[i][j]; 
        //     row += '<td>' + td + '</td>';
        // }
        for (var j in ShowLabel) {
            // var name = arrData[i][index].name === "." ? "" : arrData[i][index].name; 
            var name = ShowLabel[j];
            var td = arrData[i][name.toLowerCase()];
            if (name === "收款日期" || name === "超期日期" || name === "工作单日期") {
                if (+td < 0) {
                    td = "";
                } else {
                    td = formatDate(+td);
                }
            }
            row += '<td>' + td + '</td>';
        }
        excel += row + "</tr>";
    }
    excel += "</table>";
    // console.log(excel);
    var excelFile = "<html xmlns:o='urn:schemas-microsoft-com:office:office' " + "xmlns:x='urn:schemas-microsoft-com:office:excel' xmlns='http://www.w3.org/TR/REC-html40'>";
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">';
    excelFile += '<meta http-equiv="content-type" content="application/vnd.ms-excel';
    excelFile += '; charset=UTF-8">'; excelFile += "<head>";
    excelFile += "<!--[if gte mso 9]>";
    excelFile += "<xml>";
    excelFile += "<x:ExcelWorkbook>";
    excelFile += "<x:ExcelWorksheets>";
    excelFile += "<x:ExcelWorksheet>";
    excelFile += "<x:Name>";
    excelFile += "sheet";
    excelFile += "</x:Name>";
    excelFile += "<x:WorksheetOptions>";
    excelFile += "<x:DisplayGridlines/>";
    excelFile += "</x:WorksheetOptions>";
    excelFile += "</x:ExcelWorksheet>";
    excelFile += "</x:ExcelWorksheets>";
    excelFile += "</x:ExcelWorkbook>";
    excelFile += "</xml>";
    excelFile += "<![endif]-->";
    excelFile += "</head>";
    excelFile += "<body>";
    excelFile += excel;
    excelFile += "</body>";
    excelFile += "</html>";
    var uri = 'data:application/vnd.ms-excel;charset=utf-8,' + encodeURIComponent(excelFile);
    var link = document.createElement("a");
    link.href = uri;
    link.style = "visibility:hidden";
    link.download = FileName + ".xls";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

//生成GUID码
const S4 = () => {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}

export const NewGuid1 = () => {
    return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export const NewGuid2 = () => {
    var guid = "";
    for (var i = 1; i <= 32; i++) {
        var n = Math.floor(Math.random() * 16.0).toString(16);
        guid += n;
        if ((i == 8) || (i == 12) || (i == 16) || (i == 20))
            guid += "-";
    }
    return guid;
}