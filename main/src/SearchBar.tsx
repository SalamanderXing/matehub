import "./SearchBar.css";
import ModuleView from "./ModuleView";
import { useEffect, useState } from "react";
import Swal from 'sweetalert2'

export default () => {
  const componentTypes = ["models", "trainers", "data_loaders", "analyses"];
  const [components, setComponents] = useState({
    data_loaders: [],
    models: [],
    trainers: [],
    experiments: [],
  } as Record<string, Record<string, any>[]>);
  const [dependencies, changeDedendencies] = useState<string[]>([]);
  const [selectedComponents, setSelectedComponents] = useState(
    [] as Record<string, any>
  );
  useEffect(() => {
    (async () => {
      const tmpComponents = Object.fromEntries(
        Object.entries(components).map(([e, _]) => [e, {}])
      ) as Record<string, Record<string, any>>;
      //const proto = await fetch("./items.json");
      const proto = await fetch(
        "https://api.github.com/search/repositories?q=builtwithmate+in:readme"
      );
      const projects = (await proto.json()).items as Record<string, any>;
      const projectsWithUrl = projects.map((x: Record<string, any>) => {
        return {
          ...x,
          projects_url: `https://raw.githubusercontent.com/${x.full_name}/main/.mate/projects.json`,
        };
      });
      for await (const projectWithUrl of projectsWithUrl) {
        const result = await fetch(projectWithUrl["projects_url"]);
        const resultJson = (await result.json()) as Record<
          string,
          Record<string, Record<string, Record<string, Record<string, string>>>>
        >;
        for await (const mateProjectStructure of Object.values(resultJson)) {
          for await (const [moduleType, modules] of Object.entries(
            mateProjectStructure["project"]
          )) {
            for await (const mateModule of Object.values(modules)) {
              const moduleId =
                moduleType + mateModule["name"] + projectWithUrl["full_name"];
              tmpComponents[moduleType as string][moduleId as string] = {
                ...(mateModule as Record<string, any>),
                project: projectWithUrl as Record<string, any>,
                root_dir: `${projectWithUrl.html_url}/tree/main${mateProjectStructure["root"]}/${moduleType}/${mateModule["name"]}`,
              };
            }
          }
        }
      }
      setComponents(
        Object.fromEntries(
          Object.entries(tmpComponents).map(([e, v]) => [e, Object.values(v)])
        )
      );
    })();
  }, []);
  const search = () => {
    const select = document.getElementById("exampleFormControlSelect1")
    if (select !== null){
      const componentType = (
         select as HTMLInputElement
      ).value;
      const valuesType = components[componentType];
      const isSubSet = (target: [string, string][]): boolean => {
        const s2 = target.map((x) => x[0]);
        console.log({s2})
        console.log({dependencies})
        const result = dependencies.every(x => s2.includes(x));
        return result
      };
      const selectedValues = valuesType.filter((x) =>
        "dependencies" in x
          ? isSubSet(x["dependencies"] as [string, string][])
          : false
      );
      if (JSON.stringify(selectedValues) !== JSON.stringify(selectedComponents)){
        setSelectedComponents(selectedValues);
      }
    }
  };
  search()

  const handleAddTag = () => {
    const input = document.getElementById('dep') as HTMLInputElement
    const inputValue = input.value
    if (inputValue.trim() !== "") {
      input.value = ""
      changeDedendencies([...dependencies, inputValue]);
    }
  };

  const handleRemoveTag = (index: number) => {
    changeDedendencies(dependencies.filter((_, i) => i !== index));
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleAddTag();
    }
  };
  const showHelp = () => {
    Swal.fire({
        title:"How do I use it?",
        html:`
        <div style="text-align:center">
          <div style="width:340px; margin-left:auto; margin-right:auto;">
            <p> To install a compoment in your mate project, execute the following steps</p>
              <p><strong>1.Select a component type</strong></p>
              <p><strong>2. Add dependency filters</strong>, for example <code>torch</code> if you work with pytorch. Type <code>Enter</code> to add a dependency or click on <code>Add Dependency</code></p>
              <p><strong>3. Click</strong> on the <code>Copy Install URL</code> button next to your component. This will copy the component URL to your clipboard.</p>
              <p><strong>4.</strong> In your mate project, <strong>execute</strong> <code>mate install [paste your component URL]</code></p>
              <p><strong>5.</strong> <strong>Enjoy</strong> your new component!</p>
          </div>
          <p>Please check out the <a href="https://salamanderxing.github.io/mate/" target="_blank">Mate Docs</a></p>
        </div>
        `
      })
  }
  return (
    <div style={{ marginTop:'20px', textAlign: "center" }}>
    <h1 style={{color:'black'}}> 🧉 MateHub</h1>
    <svg onClick={showHelp} style={{zIndex:1, marginRight:'10px', marginLeft:"45vw", marginTop:'-40px', position:'fixed'}} fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" width="30px" height="30px" viewBox="0 0 416.979 416.979"
	>
<g>
	<path d="M356.004,61.156c-81.37-81.47-213.377-81.551-294.848-0.182c-81.47,81.371-81.552,213.379-0.181,294.85
		c81.369,81.47,213.378,81.551,294.849,0.181C437.293,274.636,437.375,142.626,356.004,61.156z M208.554,334.794
		c-11.028,0-19.968-8.939-19.968-19.968s8.939-19.969,19.968-19.969c11.028,0,19.968,8.939,19.968,19.969
		C228.521,325.854,219.582,334.794,208.554,334.794z M241.018,214.566c-11.406,6.668-12.381,14.871-12.43,38.508
		c-0.003,1.563-0.008,3.14-0.017,4.726c-0.071,11.172-9.147,20.18-20.304,20.18c-0.044,0-0.088,0-0.131,0
		c-11.215-0.071-20.248-9.22-20.178-20.436c0.01-1.528,0.013-3.047,0.016-4.552c0.05-24.293,0.111-54.524,32.547-73.484
		c26.026-15.214,29.306-25.208,26.254-38.322c-3.586-15.404-17.653-19.396-28.63-18.141c-3.686,0.423-22.069,3.456-22.069,21.642
		c0,11.213-9.092,20.306-20.307,20.306c-11.215,0-20.306-9.093-20.306-20.306c0-32.574,23.87-58.065,58.048-61.989
		c35.2-4.038,65.125,16.226,72.816,49.282C297.824,181.361,256.555,205.485,241.018,214.566z"/>
</g>
</svg>
      <div
        className="input-group input-group-lg noselect"
        style={{
          borderColor: "#5f8d4e",
          maxWidth: "500px",
          textAlign:'center',
          marginLeft: "auto",
          marginRight: "auto",
          marginBottom: "5px",
          marginTop: "30px",
          color: "#000",
        }}
      >
        <div
          className="input-group-prepend input-group-lg"
          style={{ borderRadius: "30px" }}
        >
          <span
            style={{
              borderRadius: "30px 0 0 30px",
              background: "#5F8D4E",
              borderColor: "#285430",
            }}
            className="input-group-text"
          >
            Type
          </span>
        </div>
        <div className="input-group-lg" style={{ borderRadius: "0 0 0 0" }}>
          <select
            className="form-select form-select-lg noselect"
            onChange={search}
            style={{
              maxWidth: "150px",
              background: "#5F8D4E",
              borderColor: "#285430",
              borderRadius: "0 0 0 0",
            }}
            id="exampleFormControlSelect1"
          >
            {componentTypes.map((m, i) => (
              <option
                className="noselect"
                style={{ borderRadius: "0 0 0 0" }}
                key={i.toString()}
              >
                {m}
              </option>
            ))}
          </select>
        </div>
        {/*<TagInput tags={tags} onChange={changeTags} />*/}
        <span
          className="input-group-text input-group-prepend"
          style={{
            borderRadius: "0 0 0 0",
            background: "#5F8D4E",
            borderColor: "#285430",
          }}
          onClick={handleAddTag}
        >
          Add Dependency
        </span>

        <input
          type="text"
          id='dep'
          onKeyDown={handleKeyDown}
          className="form-control"
          placeholder="....."
          style={{
            borderRadius: "0 30px 30px 0",
            maxWidth: "150px",
            background: "#5F8D4E",
            borderColor: "#285430",
          }}
        />
      </div>
      <div>
        {dependencies.map((tag, index) => (
          <span>
            <span
              className="badge badge-pill badge-primary"
              style={{ border: "1px solid", margin: "1px" }}
              key={index}
            >
              {tag}
              <button
                className="btn btn-sm p-0"
                style={{
                  marginLeft: "3px",
                  marginTop: "0",
                  marginBottom: "3px",
                }}
                onClick={() => handleRemoveTag(index)}
              >
                x
              </button>
            </span>
          </span>
        ))}
      </div>

      <div className="container">
        <div className="row">
          <div className="col-12">
            <div
              className="card card-margin"
              style={{
                background: "#A4BE7B",
                display: selectedComponents.length > 0 ? "block" : "none",
              }}
            >
              <div
                className="card-body"
                style={{
                  minHeight: "0",
                  display: selectedComponents.length > 0 ? "block" : "none",
                }}
              >
                <div className="row search-body">
                  <div className="col-lg-12">
                    <div className="search-result">
                      <div className="result-body">
                        <div className="table-responsive">
                          <table style={{ width: "100%" }}>
                            <thead>
                              <tr>
                                <th></th>
                                <th>Repo Name</th>
                                <th>Component Name</th>
                                <th>Time</th>
                                <th>GitHub</th>
                                <th>Dependencies</th>
                                <th>Copy Install URL</th>
                                <th>GitHub stars</th>
                              </tr>
                            </thead>
                            <tbody
                              className="widget-26"
                              style={{ width: "100%" }}
                            >
                              {selectedComponents.map(
                                (c: Record<string, any>) =>
                                  ModuleView({ module: c })
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
