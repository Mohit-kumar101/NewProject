/** Fixed ambient light orbs — creates layered 3D atmosphere behind the app. */
export function DepthAtmosphere() {
  return (
    <div className="depth-scene" aria-hidden>
      <div className="depth-scene__orb depth-scene__orb--cyan" />
      <div className="depth-scene__orb depth-scene__orb--warm" />
      <div className="depth-scene__orb depth-scene__orb--blue" />
    </div>
  );
}
