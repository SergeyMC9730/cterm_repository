var args = require('args-parser')(process.argv);
const child_process = require('child_process');
var fs = require("fs");

var print_usage = () => {
    console.log("Usage:\n - --module=<path to module>\n - --tdir=<compiled tools dir>\n - --arch=<module architecture (optional)>\n - --mname=<module name (with arch option)>\n - --mver=<module version (wth arch option)>");
    process.exit(0);
}

if(!args.module || !args.tdir) print_usage();

if(args.arch && (!args.mname || !args.mver)) {
    print_usage();
}

var arch, mname, mver;

if(!args.arch && !arch.mname && !arch.mver) {
    arch = child_process.execSync(`uname -m`).toString("utf8");
    mname = child_process.execSync(`${args.tdir}/get_module_name ${args.module}`).toString("utf8");
    mver = child_process.execSync(`${args.tdir}/get_module_version ${args.module}`).toString("utf8");
} else {
    var arch = args.arch;
    var mname = args.mname;
    var mver = args.mver;
}

if(mname.startsWith("Unknown")) {
    console.log("Error while adding module: " + mname);
    process.exit(0);
}

if(!fs.existsSync("modules")) {
    fs.mkdirSync("modules");
}

if(!fs.existsSync(`modules/${mname}`)) {
    fs.mkdirSync(`modules/${mname}`);
}

if(!fs.existsSync(`modules/${mname}/${mver}`)) {
    fs.mkdirSync(`modules/${mname}/${mver}`);
}

if(!fs.existsSync(`modules/${mname}/${mver}/${arch}`)) {
    fs.mkdirSync(`modules/${mname}/${mver}/${arch}`);
}

if(!fs.existsSync(`list.json`)) {
    fs.writeFileSync("list.json", JSON.stringify({
        "modules": [mname]
    }));
} else {
    var list = JSON.parse(fs.readFileSync(`list.json`).toString("utf8"));
    if(!list.modules.includes(mname)) list.modules.push(mname);
    fs.writeFileSync(`list.json`, JSON.stringify(list));
}

if(!fs.existsSync(`modules/${mname}/information.json`)) {
    fs.writeFileSync(`modules/${mname}/information.json`, JSON.stringify({
        "versions": [mver]
    }));
} else {
    var information = JSON.parse(fs.readFileSync(`modules/${mname}/information.json`).toString("utf8"));
    if(!information.versions.includes(mver)) information.versions.push(mver);
    fs.writeFileSync(`modules/${mname}/information.json`, JSON.stringify(information));
}

if(!fs.existsSync(`modules/${mname}/${mver}/architectures.json`)) {
    fs.writeFileSync(`modules/${mname}/${mver}/architectures.json`, JSON.stringify({
        "supported_architectures": [arch]
    }));
} else {
    var architectures = JSON.parse(fs.readFileSync(`modules/${mname}/${mver}/architectures.json`).toString("utf8"));
    if(!architectures.supported_architectures.includes(arch)) architectures.supported_architectures.push(arch);
    fs.writeFileSync(`modules/${mname}/${mver}/architectures.json`, JSON.stringify(architectures));
}

child_process.execSync(`cp ${args.module} ./modules/${mname}/${mver}/${arch}/`);

console.log(`Added ${mname}-${arch} ${mver}`);
