"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Module from "./Module";
import Lesson from "./Lesson";
import ModuleControlButtons from "./ModuleControlButtons";
import ModulesControls from "./ModulesControls";
import type { CourseModule } from "@/app/api/kambaz/types";
import * as client from "../../client";

export default function Modules() {
  const { cid } = useParams();
  const courseId = typeof cid === "string" ? cid : "RS101";
  const [modules, setModules] = useState<CourseModule[]>([]);
  const [moduleName, setModuleName] = useState("");

  async function loadModules() {
    try {
      setModules(await client.findModulesForCourse(courseId));
    } catch {
      setModules([]);
    }
  }

  useEffect(() => {
    loadModules();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- loadModules closes over courseId
  }, [courseId]);

  async function addModule() {
    if (!moduleName.trim()) return;
    await client.createModuleForCourse(courseId, { name: moduleName });
    setModuleName("");
    await loadModules();
  }

  async function deleteModule(moduleId: string) {
    await client.deleteModule(moduleId);
    await loadModules();
  }

  async function updateModule(module: CourseModule) {
    await client.updateModule(module);
    await loadModules();
  }

  function editModule(moduleId: string) {
    setModules((current) =>
      current.map((m) =>
        m._id === moduleId ? { ...m, editing: true } : m,
      ),
    );
  }

  return (
    <div className="wd-modules">
      <ModulesControls
        moduleName={moduleName}
        setModuleName={setModuleName}
        addModule={addModule}
      />
      <ul id="wd-modules" className="m-0 list-none p-0">
        {modules.map((module) => (
          <Module
            key={module._id}
            extra={
              <ModuleControlButtons
                moduleId={module._id}
                deleteModule={deleteModule}
                editModule={editModule}
              />
            }
            title={
              module.editing ? (
                <input
                  className="w-1/2 rounded border border-neutral-300 px-2 py-1 text-base"
                  defaultValue={module.name}
                  onChange={(e) =>
                    setModules((current) =>
                      current.map((m) =>
                        m._id === module._id
                          ? { ...m, name: e.target.value }
                          : m,
                      ),
                    )
                  }
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      updateModule({ ...module, editing: false });
                    }
                  }}
                />
              ) : (
                module.name
              )
            }
          >
            {module.lessons?.map((lesson) => (
              <Lesson key={lesson._id} title={lesson.name} />
            ))}
          </Module>
        ))}
      </ul>
    </div>
  );
}
