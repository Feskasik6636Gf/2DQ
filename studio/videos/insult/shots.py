"""insult: "In this world, every insult comes true, until you say sorry."
The narrator (glasses, an L on his forehead) saves his big sister from a burning roof by insulting her:
chicken -> airhead (balloon head) -> dumb as a rock (stone) -> trampoline. ~95 shots keyed to script words."""
from shotkit import *
from rbx import story
from rbx.story import *
import math, random, os, glob
import bpy
from mathutils import Vector
from rbx.sets import planks, wood, checker_mat, tiles

V = Video(__file__)
story.bind(V)
FR = 1.0 / 30


# ================================================================== small helpers
def flash(t, amt=2.2, dur=0.28):
    vs = bpy.context.scene.view_settings
    vs.exposure = 0.0
    vs.keyframe_insert("exposure", frame=max(1, F(t) - 1))
    vs.exposure = amt
    vs.keyframe_insert("exposure", frame=F(t))
    vs.exposure = 0.0
    vs.keyframe_insert("exposure", frame=F(t + dur))


def pop_in(ob, t, s=1.0, over=1.25):
    ob.scale = (0.001,) * 3
    ob.keyframe_insert("scale", frame=max(1, F(t) - 1))
    ob.scale = (s * over,) * 3
    ob.keyframe_insert("scale", frame=F(t + 0.1))
    ob.scale = (s * 0.94,) * 3
    ob.keyframe_insert("scale", frame=F(t + 0.18))
    ob.scale = (s,) * 3
    ob.keyframe_insert("scale", frame=F(t + 0.26))


def shrink_out(ob, t, s=1.0):
    ob.scale = (s,) * 3
    ob.keyframe_insert("scale", frame=F(t - 0.06))
    ob.scale = (0.001,) * 3
    ob.keyframe_insert("scale", frame=F(t + 0.04))


def keyloc(ob, t, loc, interp="BEZIER"):
    ob.location = loc
    ob.keyframe_insert("location", frame=F(t))
    set_interp(ob, "location", F(t), interp)


def keyrot(ob, t, rot, interp="BEZIER"):
    ob.rotation_euler = [math.radians(a) for a in rot]
    ob.keyframe_insert("rotation_euler", frame=F(t))
    set_interp(ob, "rotation_euler", F(t), interp)


def keyscale(ob, t, s, interp="BEZIER"):
    ob.scale = s if isinstance(s, (tuple, list)) else (s,) * 3
    ob.keyframe_insert("scale", frame=F(t))
    set_interp(ob, "scale", F(t), interp)


def tree(root):
    return [root] + list(root.children_recursive)


def vis(root, seq):
    """seq = [(t, visible), ...]: state before the first key is the opposite of the first key."""
    obs = tree(root) if not isinstance(root, (list, tuple)) else [o for r in root for o in tree(r)]
    seq = sorted(seq)
    prev = not seq[0][1]
    for t, v in seq:
        for ob in obs:
            sets.set_obj_visible(ob, t - FR, prev)
            sets.set_obj_visible(ob, t, v)
        prev = v


def M(name, c, rough=0.6, **kw):
    return mat(name, hexc(c) if isinstance(c, str) else c, rough, **kw)


_FONT = None


def kit_font():
    global _FONT
    if _FONT is None:
        c = glob.glob(os.path.expanduser("~/.fonts/TitanOne-Regular.ttf")) + \
            glob.glob(os.path.join(os.path.dirname(V.dir), "..", "fonts", "TitanOne-Regular.ttf"))
        _FONT = c[0] if c else None
    return _FONT


def label(name, body, loc, size, color="#ffffff", rot=(90, 0, 0), extrude=0.06, estr=0.0, parent=None, coll=None):
    m = mat("txt_" + color + str(estr), hexc(color), 0.4, emit=hexc(color) if estr else None, estr=estr)
    return text(name, body, loc, size, m, rot=rot, extrude=extrude, parent=parent, coll=coll, font=kit_font())


def torus(name, R, r, loc, m, parent=None, rot=(0, 0, 0)):
    bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=r, major_segments=28, minor_segments=8,
                                     location=(0, 0, 0))
    d = bpy.context.active_object
    d.name = name
    for c_ in list(d.users_collection):
        c_.objects.unlink(d)
    from rbx.core import _link
    _link(d, None)
    d.data.materials.append(m)
    bpy.ops.object.select_all(action="DESELECT")
    d.parent = parent
    d.location = loc
    d.rotation_euler = [math.radians(a) for a in rot]
    return d


def shout(name, body, loc, t_on, t_off=None, size=0.8, yaw=0.0, col="#ffffff", txt="#1a1a1a", tilt=0.0, snd="pop"):
    """Comic speech bubble: rounded white slab + black Titan One text, pops in."""
    root = empty(name, loc, rot=(0, tilt, yaw))
    lines = body.split("\n")
    wdt = max(2.2, 0.64 * max(len(l) for l in lines) * size + 1.0)
    h = 1.3 * size * len(lines) + 0.5
    box(name + "_bg", (wdt, 0.25, h), (0, 0.12, 0), M("bub_" + col, col, 0.5, emit=hexc(col), estr=0.25), min(0.5, h * 0.4),
        parent=root)
    box(name + "_rim", (wdt + 0.25, 0.2, h + 0.25), (0, 0.22, 0), M("bub_rim", "#111111", 0.5), min(0.55, h * 0.4),
        parent=root)
    cyl(name + "_tail", 0.45 * size + 0.1, 1.1 * size, (-wdt * 0.22, 0.12, -h / 2 - 0.4 * size), M("bub_" + col, col, 0.5),
        12, parent=root, r2=0.02, rot=(0, 160, 0))
    label(name + "_t", body, (0, -0.06, -0.04 * size), 1.05 * size, txt, extrude=0.03, parent=root)
    pop_in(root, t_on, 1.0, 1.3)
    if t_off:
        shrink_out(root, t_off)
    if snd:
        sfx(t_on, snd, 0.6)
    return root


def thought(name, center, t_on, s=1.0, yaw=0.0):
    root = empty(name, center, rot=(0, 0, yaw))
    Mb = mat("bubble_white", (0.98, 0.98, 1.0), 0.7, emit=(0.9, 0.92, 1.0), estr=0.35)
    rnd = random.Random(len(name))
    for i in range(9):
        a = i / 9 * math.tau
        sphere(f"{name}_c{i}", rnd.uniform(1.0, 1.3), (math.cos(a) * 1.7, 0.3, math.sin(a) * 1.15), Mb, (1, 0.5, 1),
               parent=root, seg=16)
    sphere(f"{name}_core", 1.9, (0, 0.4, 0), Mb, (1.1, 0.4, 0.8), parent=root, seg=20)
    pop_in(root, t_on, s)
    sfx(t_on, "pop", 0.6)
    return empty(name + "_content", (0, -0.9, 0), parent=root)


def speed_lines(name, center, t0, t1, n=26, r=(6, 12), seed=1, yaw=0.0, col="#ffffff"):
    """Radial anime speed lines around the subject (cards facing -Y, rotated by yaw)."""
    rnd = random.Random(seed)
    root = empty(name, center, rot=(90, 0, yaw))
    Ml = mat("spd_" + col, hexc(col), 0.5, emit=hexc(col), estr=2.0, alpha=0.75)
    for i in range(n):
        a = i / n * 360 + rnd.uniform(-5, 5)
        piv = empty(f"{name}_p{i}", (0, 0, 0), parent=root, rot=(0, 0, a))
        L = rnd.uniform(2.5, 5.0)
        ob = box(f"{name}_l{i}", (L, 0.07, 0.02), (rnd.uniform(*r) + L / 2, 0, 0), Ml, 0, parent=piv)
    for k, t in enumerate((t0, (t0 + t1) / 2)):
        pass
    noise(root, "rotation_euler", 1, 0.2, 2)
    return root


def mark(name, body, loc, t, size=1.2, col="#ffe23a", yaw=0.0):
    """Big pop-up word in 3D (onomatopoeia stamp)."""
    root = empty(name, loc, rot=(0, 0, yaw))
    label(name + "_o", body, (0, 0.06, 0), size, "#111111", extrude=0.12, parent=root)
    label(name + "_f", body, (0, -0.04, 0), size, col, extrude=0.04, estr=0.6, parent=root)
    pop_in(root, t, 1.0, 1.4)
    noise(root, "rotation_euler", 1, 0.08, 6)
    return root


# ================================================================== cast
def nerd_glasses(ch, big=False, name=None):
    n = name or ch.name + "_specs"
    root = empty(n, (0, 0, 0), parent=ch.head)
    Mk = M("specs_black", "#151515", 0.3)
    Mg = mat("specs_glass", (0.85, 0.95, 1.0), 0.05, emit=(0.8, 0.9, 1.0), estr=0.15, alpha=0.35)
    R = 0.34 if big else 0.22
    x = 0.36 if big else 0.25
    for sx in (-1, 1):
        torus(f"{n}_rim{sx}", R, 0.05 if not big else 0.07, (sx * x, -0.67, 0.14), Mk, parent=root, rot=(90, 0, 0))
        cyl(f"{n}_lens{sx}", R, 0.02, (sx * x, -0.66, 0.14), Mg, 20, parent=root, rot=(90, 0, 0))
        box(f"{n}_arm{sx}", (0.05, 0.75, 0.05), (sx * 0.63, -0.3, 0.2), Mk, 0, parent=root)
    box(f"{n}_br", (x * 2 - R * 2 + 0.06, 0.05, 0.06), (0, -0.67, 0.2), Mk, 0, parent=root)
    return root


def L_mark(ch):
    return label(ch.name + "_L", "L", (0, -0.66, 0.36), 0.36, "#e8322a", extrude=0.04, estr=0.4, parent=ch.head)


def hero(t0, t1, expr="neutral", glasses=True, L=True, scale=1.0, name="Hero", short=False):
    s = scale * (0.92 if short else 1.0)
    H = story._live(chars.Char(name, skin="#f1dfc6", shirt="#4aa5e8", pants="#2f3f6a", hair="buzz",
                               hair_color="#5a3a22", face="hero", vneck="#a8d8ff", scale=s, bolt="#f2c14e"), t0, t1, expr)
    H.specs = nerd_glasses(H) if glasses else None
    H.Lm = L_mark(H) if L else None
    return H


def sis(t0, t1, expr="neutral", name="Sis", sooty=False):
    S_ = story._live(chars.Char(name, skin="#f2dbc6", shirt="#9b6ad6", pants="#3a3f6a", hair="bun",
                                hair_color="#3a2414", face="girl", sleeves="long", vneck="#c9a6f0", scale=1.06), t0, t1, expr)
    if sooty:
        Ms = M("soot", "#2a2a2a", 0.9)
        for i, (x, z) in enumerate(((0.3, -0.25), (-0.35, 0.3), (0.1, 0.45))):
            sphere(f"{name}_soot{i}", 0.09, (x, -0.63, z), Ms, (1.3, 0.4, 0.8), parent=S_.head, seg=8)
    return S_


def grandpa(t0, t1, expr="smile", fossil=False, name=None):
    if fossil:
        G = chars.Char(name or "Fossil", skin="#dccfb0", shirt="#cdbf9e", pants="#b9aa88", hair="bald", face="mustache",
                       sleeves="long", extras=("glasses:#7a6a4a", "beard:#d6c9a8"))
        Mc = M("fossil_crack", "#8a7a5a", 0.9)
        rnd = random.Random(5)
        for i in range(7):
            box(f"{G.name}_cr{i}", (rnd.uniform(0.3, 0.7), 0.04, 0.05), (rnd.uniform(-0.7, 0.7), -0.52, rnd.uniform(0.4, 1.8)),
                Mc, 0, parent=G.hip, rot=(0, rnd.uniform(-50, 50), 0))
        story._live(G, t0, t1, expr, 0.3)
        return G
    G = chars.Char(name or "Grandpa", skin="#efd9c0", shirt="#c8873a", pants="#5a4a3a", hair="bald", face="mustache",
                   sleeves="long", vneck="#f4efe4", extras=("glasses", "beard"))
    return story._live(G, t0, t1, expr, 0.6)


def bully(i, t0, t1, expr="smug"):
    cols = {1: ("#e8574a", "#2b2b2b", "slick", "#151212"), 2: ("#2b2b2b", "#3a3a4a", "buzz", "#3a2a1e"),
            3: ("#63c06a", "#2d3a58", "messy", "#e0c060")}[i]
    B = chars.Char(f"Bully{i}", skin=["#d9b48f", "#a8714a", "#f1dfc6"][i - 1], shirt=cols[0], pants=cols[1], hair=cols[2],
                   hair_color=cols[3], face="villain" if i == 2 else "plain", scale=1.1, seed=i)
    return story._live(B, t0, t1, expr)


def teacher(t0, t1, expr="neutral"):
    return story._live(chars.teacher("Teach"), t0, t1, expr)


def coach(t0, t1, expr="neutral"):
    C = chars.Char("Coach", skin="#d9b48f", shirt="#e8574a", pants="#2a2d36", hair="cap", hair_color="#2a5ad0",
                   face="mustache", sleeves="short", extras=("collar:#f4f4f4",), scale=1.1)
    cyl("Coach_whistle", 0.12, 0.3, (0, -0.56, 1.6), M("whistle", "#d0d4da", 0.2, metal=1.0), 12, parent=C.hip,
        rot=(90, 0, 0))
    return story._live(C, t0, t1, expr)


def ff(i, t0, t1, expr="worried"):
    return story._live(chars.firefighter(f"FF{i}", skin=["#d8b896", "#a8714a", "#f1dfc6"][i % 3]), t0, t1, expr)


def kidc(i, t0, t1, expr="neutral", **kw):
    return story._live(chars.kid(i, **kw), t0, t1, expr)


# ================================================================== transformations / props
def chicken(name, loc, s=1.0, rot=0, stone=False, balloon=False, hair=True):
    """Chunky chicken facing -Y (her bob haircut on top). Root at the feet. Returns dict(root, wL, wR, head, ball)."""
    root = empty(name, loc, rot=(0, 0, rot))
    root.scale = (s,) * 3
    if stone:
        Mw, Mr, My, Mh, Mb = (M("rock_a", "#c4c8d0", 0.95), M("rock_b", "#9a9ea6", 0.95), M("rock_c", "#b0b4bc", 0.95),
                              M("rock_d", "#80848c", 0.95), M("rock_e", "#c8ccd4", 0.9))
    else:
        Mw, Mr, My, Mh = M("chk_white", "#fbf8f2", 0.7), M("chk_red", "#e0302a", 0.45), M("chk_yel", "#f6b42a", 0.4), \
            M("chk_hair", "#3a2414", 0.4)
        Mb = mat("balloon_pink", hexc("#ffb6de"), 0.2, coat=1.0, emit=hexc("#ff8cc8"), estr=0.9)
    Mk = M("chk_eye", "#111111", 0.2)
    body = sphere(name + "_body", 1.0, (0, 0.15, 1.9), Mw, (1.0, 1.25, 0.95), parent=root, seg=24)
    for k in range(3):
        sphere(f"{name}_tail{k}", 0.42, (0, 1.25 + 0.05 * k, 2.4 + k * 0.32), Mw, (0.35, 0.9, 0.5), parent=root,
               rot=(-30 - k * 15, 0, 0), seg=12)
    wings = []
    for sx in (-1, 1):
        wp = empty(f"{name}_w{sx}", (sx * 0.92, 0.0, 2.25), parent=root)
        sphere(f"{name}_wing{sx}", 0.6, (sx * 0.12, 0.15, -0.25), Mw, (0.28, 1.0, 0.65), parent=wp, seg=14)
        wings.append(wp)
    for sx in (-1, 1):
        cyl(f"{name}_leg{sx}", 0.09, 1.0, (sx * 0.35, 0.1, 0.55), My, 8, parent=root)
        for k in (-1, 0, 1):
            box(f"{name}_toe{sx}{k}", (0.09, 0.42, 0.07), (sx * 0.35 + k * 0.12, -0.12, 0.05), My, 0.02, parent=root,
                rot=(0, 0, k * 25))
    head = empty(name + "_head", (0, -0.75, 2.85), parent=root)
    hd = empty(name + "_hd", (0, 0, 0), parent=head)
    sphere(name + "_skull", 0.62, (0, 0, 0.35), Mw, (1, 1, 1.05), parent=hd, seg=20)
    for k in range(3):
        sphere(f"{name}_comb{k}", 0.2, (0, -0.15 + k * 0.2, 1.0 - abs(k - 1) * 0.08), Mr, (0.6, 1, 1), parent=hd, seg=10)
    cyl(name + "_beak", 0.2, 0.5, (0, -0.78, 0.3), My, 12, parent=hd, r2=0.01, rot=(90, 0, 0))
    sphere(name + "_wattle", 0.14, (0, -0.6, 0.0), Mr, (0.8, 0.6, 1.4), parent=hd, seg=10)
    for sx in (-1, 1):
        sphere(f"{name}_eye{sx}", 0.11, (sx * 0.28, -0.5, 0.55), Mk, (1, 0.6, 1.2), parent=hd, seg=10)
        sphere(f"{name}_glint{sx}", 0.035, (sx * 0.25, -0.58, 0.6), M("glint", "#ffffff", 0.2, emit=hexc("#ffffff"), estr=2),
               parent=hd, seg=6)
    if hair:
        sphere(name + "_bob", 0.66, (0, 0.12, 0.62), Mh, (1.05, 1.0, 0.62), parent=hd, seg=18)
        box(name + "_fringe", (0.9, 0.25, 0.22), (0, -0.48, 0.82), Mh, 0.1, parent=hd)
    # balloon head (hidden until inflated)
    ball = empty(name + "_ball", (0, 0, 0.3), parent=head)
    bl = sphere(name + "_bln", 1.55, (0, 0.1, 1.25), Mb, (1, 1, 1.1), parent=ball, seg=28)
    sphere(name + "_blglint", 0.32, (0.55, -1.2, 1.9), M("glint", "#ffffff", 0.2, emit=hexc("#ffffff"), estr=2),
           (1, 0.4, 1.3), parent=ball, seg=10)
    for sx in (-1, 1):
        sphere(f"{name}_beye{sx}", 0.2, (sx * 0.55, -1.38, 1.45), Mk, (1, 0.5, 1.3), parent=ball, seg=12)
    cyl(name + "_bbeak", 0.24, 0.55, (0, -1.75, 1.05), My, 12, parent=ball, r2=0.01, rot=(90, 0, 0))
    for k in range(3):
        sphere(f"{name}_bcomb{k}", 0.25, (0, -0.25 + k * 0.28, 2.9 - abs(k - 1) * 0.1), Mr, (0.6, 1, 1), parent=ball, seg=10)
    if hair:
        sphere(name + "_btuft", 0.45, (0, 0.5, 2.75), Mh, (1.2, 1, 0.5), parent=ball, seg=14)
    cyl(name + "_bknot", 0.12, 0.25, (0, 0.1, -0.35), Mb, 10, parent=ball, r2=0.2)
    noise(head, "rotation_euler", 2, 0.12, 12)
    d = dict(root=root, wL=wings[1], wR=wings[0], head=head, hd=hd, ball=ball)
    if balloon:
        hd.scale = (0.001,) * 3
    else:
        ball.scale = (0.001,) * 3
    return d


def inflate(C, t, dur=0.35):
    """Chicken head -> balloon at t (normal head hidden, balloon pops up with wobble)."""
    keyscale(C["hd"], t - FR, 1.0)
    keyscale(C["hd"], t, 0.001)
    b = C["ball"]
    for dt, k in ((-FR, 0.001), (0.0, 0.3), (dur * 0.6, 1.18), (dur * 0.85, 0.94), (dur * 1.1, 1.04), (dur * 1.4, 1.0)):
        keyscale(b, t + dt, (k, k, k * (1.0 + 0.08 * (k > 1))))


def flap(C, t0, t1, rate=8.0, amp=70, base=10):
    n = int((t1 - t0) * rate * 2) + 1
    for i in range(n + 1):
        t = t0 + i / (rate * 2)
        if t > t1 + 0.01:
            break
        a = base + (amp if i % 2 == 0 else -amp * 0.4)
        keyrot(C["wL"], t, (0, -a, 0), "BEZIER")
        keyrot(C["wR"], t, (0, a, 0), "BEZIER")


def banana_head(ch, name=None):
    n = name or ch.name + "_banana"
    root = empty(n, (0, 0, 0.3), parent=ch.neck)
    My, Mb, Mk = M("banana_y", "#f6d23a", 0.45), M("banana_tip", "#5a3a1a", 0.6), M("chk_eye", "#111111", 0.2)
    pts = [(-0.55, 0.0, 0.05), (-0.3, 0.0, 0.6), (0.05, 0.0, 1.05), (0.45, 0.0, 1.35)]
    for k in range(len(pts) - 1):
        a, b = Vector(pts[k]), Vector(pts[k + 1])
        mid = (a + b) / 2
        d = b - a
        ang = math.degrees(math.atan2(d.x, d.z))
        cyl(f"{n}_s{k}", 0.48 - 0.06 * abs(k - 1), d.length + 0.25, tuple(mid), My, 18, bev=0.1, parent=root, rot=(0, ang, 0))
    cyl(n + "_tip", 0.1, 0.35, (0.6, 0, 1.5), Mb, 8, parent=root, rot=(0, 55, 0))
    cyl(n + "_bot", 0.14, 0.2, (-0.6, 0, -0.12), Mb, 8, parent=root, rot=(0, -20, 0))
    for sx in (-1, 1):
        sphere(f"{n}_eye{sx}", 0.12, (-0.12 + sx * 0.22, -0.44, 0.62), Mk, (1, 0.5, 1.3), parent=root, seg=10)
    box(n + "_mouth", (0.35, 0.05, 0.08), (-0.1, -0.45, 0.25), Mk, 0.03, parent=root, rot=(0, -10, 0))
    return root


def head_parts(ch):
    """The head mesh and everything parented to it (hair, glasses, marks)."""
    return ch.head


def pig_bits(ch):
    n = ch.name + "_pig"
    root = empty(n, (0, 0, 0), parent=ch.head)
    Mp, Md = M("pig_pink", "#f59bb5", 0.45), M("pig_dark", "#b2506a", 0.5)
    cyl(n + "_snout", 0.3, 0.3, (0, -0.72, -0.02), Mp, 20, bev=0.06, parent=root, rot=(90, 0, 0))
    for sx in (-1, 1):
        sphere(f"{n}_nos{sx}", 0.06, (sx * 0.1, -0.88, -0.02), Md, (1, 0.5, 1.4), parent=root, seg=8)
        cyl(f"{n}_ear{sx}", 0.25, 0.42, (sx * 0.45, -0.05, 0.75), Mp, 4, parent=root, r2=0.01, rot=(0, sx * 25, 45))
    return root


def turtle(name, loc, s=1.0, rot=0, jersey="#e8574a"):
    root = empty(name, loc, rot=(0, 0, rot))
    root.scale = (s,) * 3
    Mg, Md, Ms = M("turtle_shell", "#3f8f3a", 0.5, coat=0.4), M("turtle_dk", "#2b6a2a", 0.5), M("turtle_skin", "#9ad46a", 0.6)
    sphere(name + "_shell", 1.35, (0, 0.1, 0.85), Mg, (1.0, 1.25, 0.62), parent=root, seg=22)
    for i, (x, y) in enumerate(((0, 0.1), (0.6, -0.5), (-0.6, -0.5), (0.6, 0.7), (-0.6, 0.7), (0, -0.95), (0, 1.1))):
        sphere(f"{name}_hex{i}", 0.38, (x, y, 1.55 - 0.18 * (abs(x) + abs(y) * 0.5)), Md, (1, 1, 0.25), parent=root, seg=10)
    cyl(name + "_rim", 1.38, 0.28, (0, 0.1, 0.55), M("jersey" + jersey, jersey, 0.5), 24, parent=root, rot=(0, 0, 0))
    root_s = root
    for sx in (-1, 1):
        for sy in (-1, 1):
            sphere(f"{name}_leg{sx}{sy}", 0.36, (sx * 1.05, 0.1 + sy * 0.95, 0.32), Ms, (1, 1.1, 0.8), parent=root, seg=12)
    hp = empty(name + "_hp", (0, -1.55, 0.8), parent=root)
    sphere(name + "_head", 0.55, (0, -0.15, 0.2), Ms, (1, 1.15, 0.95), parent=hp, seg=16)
    for sx in (-1, 1):
        sphere(f"{name}_eye{sx}", 0.1, (sx * 0.24, -0.72, 0.42), M("chk_eye", "#111111", 0.2), (1, 0.5, 1.2), parent=hp, seg=8)
    noise(hp, "rotation_euler", 2, 0.2, 15)
    return root_s


def trex(name, loc, s=1.0, rot=0):
    """T-Rex skeleton on a stand, head toward -X (rot 0). Root at floor. ~16 long, 10 tall at s=1."""
    root = empty(name, loc, rot=(0, 0, rot))
    root.scale = (s,) * 3
    Mb, Mk = M("bone", "#efe6cf", 0.55), M("bone_dark", "#2a2622", 0.6)
    Mst = M("stand_metal", "#3a3d44", 0.3, metal=0.8)
    for x in (-2, 3):
        cyl(f"{name}_pole{x}", 0.12, 6.0, (x, 0, 3.0), Mst, 10, parent=root)
    box(name + "_base", (12, 4, 0.5), (0, 0, 0.25), M("plinth", "#5a4636", 0.6), 0.1, parent=root)
    # spine (series of vertebrae from neck to tail tip)
    pts = [(-5.2, 0, 7.6), (-4.2, 0, 7.2), (-3.0, 0, 6.9), (-1.6, 0, 6.8), (0, 0, 6.8), (1.6, 0, 6.6), (3.2, 0, 6.2),
           (4.8, 0, 5.6), (6.4, 0, 4.9), (8.0, 0, 4.2), (9.4, 0, 3.6), (10.6, 0, 3.2)]
    for k, p in enumerate(pts):
        r = 0.55 - 0.035 * k if k > 3 else 0.5
        box(f"{name}_vert{k}", (0.9 * max(r, 0.2) * 2, 0.7 * max(r, 0.2) * 2, 0.75 * max(r, 0.2) * 2), p, Mb, 0.12, parent=root)
        if 2 <= k <= 7:
            box(f"{name}_spike{k}", (0.25, 0.22, 0.9), (p[0], 0, p[2] + 0.75), Mb, 0.08, parent=root)
    # ribs
    for k in range(6):
        x = -2.6 + k * 0.9
        h = 2.6 - abs(k - 2.5) * 0.35
        for sy in (-1, 1):
            piv = empty(f"{name}_rp{k}{sy}", (x, 0, 6.7), parent=root, rot=(sy * 25, 0, 0))
            box(f"{name}_rib{k}{sy}", (0.22, 0.22, h), (0, sy * 0.5, -h / 2), Mb, 0.08, parent=piv,
                rot=(sy * 12, 0, 0))
    # pelvis + legs
    box(name + "_pelvis", (2.2, 1.6, 1.4), (1.6, 0, 6.0), Mb, 0.3, parent=root)
    for sy in (-1, 1):
        lp = empty(f"{name}_lp{sy}", (1.6, sy * 0.9, 5.6), parent=root, rot=(0, -18, 0))
        box(f"{name}_thigh{sy}", (0.7, 0.6, 2.8), (0, 0, -1.3), Mb, 0.2, parent=lp)
        kp = empty(f"{name}_kp{sy}", (0, 0, -2.7), parent=lp, rot=(0, 42, 0))
        box(f"{name}_shin{sy}", (0.5, 0.5, 2.6), (0, 0, -1.2), Mb, 0.15, parent=kp)
        box(f"{name}_foot{sy}", (1.6, 0.8, 0.35), (-0.5, 0, -2.6), Mb, 0.12, parent=kp, rot=(0, -24, 0))
        ap = empty(f"{name}_arm{sy}", (-2.7, sy * 0.7, 6.0), parent=root, rot=(0, 30, 0))
        box(f"{name}_tiny{sy}", (0.22, 0.22, 1.0), (0, 0, -0.45), Mb, 0.06, parent=ap)
    # skull
    hp = empty(name + "_headpiv", (-5.6, 0, 7.9), parent=root, rot=(0, 8, 0))
    box(name + "_skull", (3.2, 1.5, 1.5), (-1.4, 0, 0.2), Mb, 0.35, parent=hp)
    for sy in (-1, 1):
        sphere(f"{name}_socket{sy}", 0.32, (-0.9, sy * 0.72, 0.45), Mk, (1, 0.5, 1), parent=hp, seg=10)
    for k in range(7):
        cyl(f"{name}_tooth{k}", 0.08, 0.35, (-2.6 + k * 0.32, -0.62, -0.62), Mb, 6, parent=hp, r2=0.01, rot=(180, 0, 0))
    jp = empty(name + "_jaw", (-0.2, 0, -0.45), parent=hp, rot=(0, -10, 0))
    box(name + "_jawb", (2.9, 1.3, 0.45), (-1.3, 0, -0.1), Mb, 0.15, parent=jp)
    noise(jp, "rotation_euler", 1, 0.05, 20)
    return root


def calendar(name, loc, t0, labels, rot=0):
    root = empty(name, loc, rot=(0, 0, rot))
    box(name + "_back", (3.0, 0.15, 3.6), (0, 0.1, 0), M("cal_back", "#f4f4f4", 0.6), 0.05, parent=root)
    box(name + "_top", (3.0, 0.2, 0.8), (0, -0.02, 1.6), M("cal_red", "#d9453a", 0.5), 0.05, parent=root)
    pages = []
    for k, (t, txt) in enumerate(labels):
        pg = empty(f"{name}_pg{k}", (0, -0.05 - 0.02 * (len(labels) - k), 1.2), parent=root)
        plane(f"{name}_pp{k}", 2.8, 2.6, (0, 0, -1.4), M("cal_page", "#fbfbf6", 0.7), (90, 0, 0), parent=pg)
        label(f"{name}_pt{k}", txt, (0, -0.03, -1.4), 0.8, "#222222", extrude=0.01, parent=pg)
        pages.append(pg)
    for k, (t, txt) in enumerate(labels[:-1]):
        tt = labels[k + 1][0]
        keyrot(pages[k], tt - 0.08, (0, 0, 0))
        keyrot(pages[k], tt + 0.08, (-170, 0, 0))
        vis(pages[k], [(tt + 0.1, False)])
        sfx(tt - 0.06, "paper", 0.6)
    return root


# ================================================================== sets
def night_sky(strength=0.45):
    W.sky(strength, top=(0.01, 0.015, 0.05), bottom=(0.16, 0.06, 0.05))


HOUSE_FRONT = 6.0
ROOF_Z = 13.0
ROOF_P = (0.0, 7.4, ROOF_Z)          # sister on the roof edge
HERO_P = (3.0, -8.0, 0.0)            # narrator on the lawn (faces the house: rot 180)
TRAMP = (0.0, -1.5, 0.0)
TRUCK = (-17.0, -6.0, 0.0)


def fire_house(t0, t1, fire=1.0, smoke=True, truck=True, ladder=1.0, tramp=False, climb=None, street=True):
    """Night: two-storey house on fire (front at y=6, flat roof z=13), fire truck with its short ladder,
    street behind the lawn. climb=(ta, tb): flames climb the front wall between ta and tb."""
    c = collection("FIRE")
    night_sky()
    box("fh_lawn", (300, 300, 0.4), (0, 0, -0.2), M("lawn_night", "#2f5a2a", 0.95), 0, coll=c)
    box("fh_road", (300, 9, 0.06), (0, -15, 0.03), M("asphalt_night", "#2a2b30", 0.8), 0, coll=c)
    box("fh_walk", (300, 2.5, 0.12), (0, -9.5, 0.06), M("walk_night", "#6a6a70", 0.8), 0, coll=c)
    box("fh_path", (3, 7, 0.1), (0, 2, 0.05), M("walk_night", "#6a6a70", 0.8), 0, coll=c)
    Mh = tiles("fh_siding", "#d9c7a0", "#b8a582", 0.9, 0.5, 0.5, 0.8, axis="XZ")
    box("fh_body", (18, 10, ROOF_Z), (0, HOUSE_FRONT + 5, ROOF_Z / 2), Mh, 0.05, coll=c)
    Mtrim = M("fh_trim", "#f4f0e6", 0.6)
    box("fh_roofslab", (19, 11, 0.6), (0, HOUSE_FRONT + 5, ROOF_Z - 0.2), M("fh_roof", "#4a3a3a", 0.8), 0.05, coll=c)
    for sx in (-1, 1):
        box(f"fh_par{sx}", (0.5, 11, 0.9), (sx * 9.25, HOUSE_FRONT + 5, ROOF_Z + 0.4), Mtrim, 0.05, coll=c)
    box("fh_parf", (19, 0.5, 0.9), (0, HOUSE_FRONT - 0.25, ROOF_Z + 0.4), Mtrim, 0.05, coll=c)
    box("fh_chimney", (2, 2, 4), (5.5, HOUSE_FRONT + 7, ROOF_Z + 2), M("brick", "#9a4a3a", 0.8), 0.05, coll=c)
    box("fh_floorline", (18.4, 0.4, 0.5), (0, HOUSE_FRONT - 0.1, 6.5), Mtrim, 0.05, coll=c)
    box("fh_door", (2.6, 0.3, 4.6), (0, HOUSE_FRONT - 0.1, 2.3), M("door_red", "#8a2a22", 0.5), 0.05, coll=c)
    Mwin = mat("fh_win_fire", hexc("#ffb050"), 0.3, emit=hexc("#ff8a2a"), estr=9.0 * fire + 0.5)
    for x in (-5.5, 5.5):
        for z in (3.4, 9.6):
            card(f"fh_win{x}{z}", 3.4, 3.0, (x, HOUSE_FRONT - 0.03, z), Mwin, "-Y", coll=c)
            for dz in (-1.6, 1.6):
                box(f"fh_wf{x}{z}{dz}", (3.9, 0.3, 0.3), (x, HOUSE_FRONT - 0.12, z + dz), Mtrim, 0.03, coll=c)
            box(f"fh_wv{x}{z}", (0.25, 0.3, 3.0), (x, HOUSE_FRONT - 0.12, z), Mtrim, 0.03, coll=c)
    # neighbours (dark, a few warm windows) both sides and across the street
    rnd = random.Random(3)
    for k, (x, y, w, h) in enumerate(((-26, 10, 12, 9), (26, 10, 12, 10), (-30, -32, 13, 9), (-12, -32, 12, 8),
                                      (6, -32, 12, 10), (24, -32, 12, 8), (42, -32, 12, 9))):
        box(f"fh_nb{k}", (w, 10, h), (x, y, h / 2), M("nb" + str(k % 3), ["#3e4a66", "#4a3e5a", "#36505a"][k % 3], 0.8), 0.1,
            coll=c)
        box(f"fh_nbr{k}", (w + 0.8, 10.8, 1.0), (x, y, h + 0.5), M("nbroof", "#262630", 0.8), 0.1, coll=c)
        side = -1 if y > 0 else 1
        for q in range(2):
            if rnd.random() < 0.7:
                card(f"fh_nbw{k}{q}", 2.2, 2.0, (x - 2.5 + q * 5, y + side * 5.02, h * 0.55),
                     mat("nbwin", hexc("#ffd890"), 0.4, emit=hexc("#ffc060"), estr=3.0), "-Y" if side < 0 else "+Y",
                     coll=c)
    for k, x in enumerate((-40, -14, 14, 40)):
        sphere(f"fh_tree{k}", 3.0, (x, 2 if abs(x) > 20 else -22, 5), M("tree_night", "#1e3a22", 0.9), (1, 1, 1.3), coll=c)
        cyl(f"fh_trunk{k}", 0.4, 4, (x, 2 if abs(x) > 20 else -22, 2), M("bark", "#3a2a1a", 0.9), 8, coll=c)
    sphere("fh_moon", 4, (-60, 160, 70), mat("moon_glow", hexc("#f4f0d8"), 0.5, emit=hexc("#f4f0d8"), estr=4.0), coll=c)
    light("fh_moonl", "SUN", (0, 0, 50), 0.6, (0.5, 0.62, 1.0), 3, coll=c, rot=(55, 0, 200))
    light("fh_cool", "AREA", (0, -22, 16), 14000, (0.62, 0.72, 1.0), 20, coll=c, target=(0, 0, 6))
    light("fh_coolb", "AREA", (0, 4, 18), 5000, (0.62, 0.72, 1.0), 16, coll=c, target=(0, -8, 3))
    # fire
    if fire > 0:
        for i, (x, z) in enumerate(((-5.5, 3.4), (5.5, 3.4), (-5.5, 9.6), (5.5, 9.6))):
            fx.fire_cluster(f"fh_fw{i}", (x, HOUSE_FRONT - 0.5, z - 1.4), (1.3, 0.2, 0), 3, (2.5, 4.0), (1.4, 2.2), coll=c,
                            seed=i + 1, strength=16 * fire)
        fx.fire_cluster("fh_froof", (0, HOUSE_FRONT + 6, ROOF_Z + 0.2), (7, 4, 0), 7, (3.0, 6.0), (2.0, 3.4), coll=c, seed=9,
                        strength=14 * fire)
        fx.fire_cluster("fh_fside", (-8.5, HOUSE_FRONT + 4, 7), (0.3, 3, 4), 4, (3, 5), (2, 3), coll=c, seed=12,
                        strength=12 * fire, yaw_base=90)
        lts = fx.fire_lights("fh_fl", [(-5.5, HOUSE_FRONT - 2.5, 4.0), (5.5, HOUSE_FRONT - 2.5, 9.0),
                                       (0, HOUSE_FRONT + 4, ROOF_Z + 4)], energy=4500 * fire, coll=c, radius=2.0)
        light("fh_glow", "AREA", (0, HOUSE_FRONT - 4, 8), 9000 * fire, (1.0, 0.5, 0.18), 14, coll=c, target=(0, -10, 3))
        fx.embers("fh_emb", (-9, HOUSE_FRONT - 2, 2), (9, HOUSE_FRONT + 8, ROOF_Z + 6), n=70, coll=c, seed=4)
    if climb:
        ta, tb = climb
        for i, x in enumerate((-8, -3, 2.5, 7.5)):
            fl = fx.fire_card(f"fh_climb{i}", (x, HOUSE_FRONT - 0.6, 2.0), 3.0, 4.5, random.uniform(-20, 20), c, 16)
            keyloc(fl, ta, (x, HOUSE_FRONT - 0.6, 2.0 + i * 0.4))
            keyloc(fl, tb, (x, HOUSE_FRONT - 0.6, 10.5 + i * 0.4))
            keyscale(fl, ta, 0.7)
            keyscale(fl, tb, 1.35)
    if smoke:
        Msk = mat("smoke", hexc("#2a2628"), 0.95, alpha=0.88)
        rnd = random.Random(8)
        for i in range(16):
            p = (rnd.uniform(-8, 8), HOUSE_FRONT + rnd.uniform(4, 12), ROOF_Z + rnd.uniform(5, 18))
            sm = sphere(f"fh_smoke{i}", rnd.uniform(3.0, 5.5), p, Msk, (1.2, 1, 0.9), coll=c, seg=14)
            sm.visible_shadow = False
            keyloc(sm, t0 - 0.2, p, "LINEAR")
            keyloc(sm, t1 + 0.2, (p[0] + 1.2, p[1] + 0.5, p[2] + 2.0 * (t1 - t0 + 0.4)), "LINEAR")
    if truck:
        tr = empty("truck", TRUCK, coll=c)
        Mr = M("truck_red", "#c4211c", 0.3, metal=0.2)
        box("truck_body", (14, 5.6, 5.2), (0, 0, 3.4), Mr, 0.3, parent=tr)
        box("truck_cab", (4.4, 5.6, 6.6), (8.6, 0, 3.9), Mr, 0.3, parent=tr)
        card("truck_ws", 3.6, 2.4, (10.83, 0, 5.6), M("truck_glass", "#20304a", 0.1), "+X", parent=tr)
        box("truck_stripe", (18.6, 5.7, 0.5), (2, 0, 2.6), M("stripe_w", "#f2f2f2", 0.4), 0.05, parent=tr)
        for k, x in enumerate((-4.5, 7.5)):
            for sy in (-1, 1):
                cyl(f"truck_wh{k}{sy}", 1.3, 0.8, (x, sy * 2.8, 1.3), M("tire", "#151515", 0.8), 20, parent=tr, rot=(90, 0, 0))
        Mlb = mat("lightbar_red", (1, 0.1, 0.1), emit=(1, 0.1, 0.08), estr=25)
        box("truck_lb", (0.8, 4.2, 0.5), (8.6, 0, 7.45), Mlb, 0.1, parent=tr)
        lt = light("truck_flash", "POINT", (TRUCK[0] + 8, TRUCK[1] - 3, 9), 3000, (1, 0.12, 0.1), 1.0, coll=c)
        fx.flicker(lt, 0.9, 1.2)
        lb = light("truck_flash_b", "POINT", (TRUCK[0] + 8, TRUCK[1] + 3, 9), 2000, (0.2, 0.35, 1.0), 1.0, coll=c)
        fx.flicker(lb, 0.9, 1.0)
        if ladder:
            base = Vector((TRUCK[0] + 2, TRUCK[1] + 1, 6.2))
            top = Vector((-6.5, HOUSE_FRONT - 1.0, 7.8))
            piv = empty("ladder", tuple(base), coll=c)
            aim(piv, tuple(top))
            Lg = (top - base).length
            Mlm = M("ladder_metal", "#c8ccd2", 0.25, metal=0.9)
            lad = empty("ladder_s", (0, 0, 0), parent=piv)
            for sx in (-1, 1):
                box(f"lad_rail{sx}", (0.18, 0.18, Lg), (sx * 0.7, 0, -Lg / 2), Mlm, 0.02, parent=lad)
            for k in range(int(Lg / 0.9)):
                box(f"lad_rung{k}", (1.4, 0.12, 0.12), (0, 0, -0.5 - k * 0.9), Mlm, 0.02, parent=lad)
            lad.scale = (1, 1, ladder)
    if tramp:
        Mt = M("tramp_black", "#18181c", 0.6)
        tp = empty("tramp", TRAMP, coll=c)
        cyl("tramp_mat", 2.7, 0.12, (0, 0, 2.3), Mt, 32, parent=tp)
        torus("tramp_rim", 2.8, 0.22, (0, 0, 2.35), M("tramp_red", "#d9453a", 0.4), parent=tp)
    return dict(coll=c)


def ladder_obj():
    return bpy.data.objects.get("ladder_s")


def street_day():
    town_scene()


def field_set():
    c = collection("FIELD")
    W.sky(1.0)
    W.sun(4.0, rot=(50, 0, 30), coll=c)
    box("fd_grass", (300, 300, 0.4), (0, 0, -0.2), checker_mat("fd_grass", "#4fae4a", "#5cbc55", 0.08), 0, coll=c)
    Ml = M("fd_line", "#f4f4f4", 0.6)
    for k in range(-3, 4):
        box(f"fd_line{k}", (60, 0.3, 0.05), (0, k * 8.0, 0.03), Ml, 0, coll=c)
    Mg = M("goal_yel", "#f2c14e", 0.4)
    gx, gy = 0, 34
    cyl("goal_post", 0.25, 6, (gx, gy, 3), Mg, 12, coll=c)
    box("goal_bar", (10, 0.4, 0.4), (gx, gy, 6), Mg, 0.05, coll=c)
    for sx in (-1, 1):
        cyl(f"goal_up{sx}", 0.22, 8, (gx + sx * 5, gy, 10), Mg, 12, coll=c)
    for r in range(4):
        box(f"fd_bleach{r}", (50, 2.0, 1.2), (0, 46 + r * 2, 0.6 + r * 1.2), M("bleach", "#9aa4b8", 0.4, metal=0.5), 0.05, coll=c)
    rnd = random.Random(2)
    for i in range(30):
        col = ["#e8574a", "#4aa5e8", "#f2c14e", "#ffffff", "#63c06a"][i % 5]
        sphere(f"fd_fan{i}", 0.6, (rnd.uniform(-22, 22), 46 + (i % 4) * 2, 2.2 + (i % 4) * 1.2), M("fan" + col, col, 0.6),
               (1, 1, 1.3), coll=c, seg=10)
    for k, x in enumerate((-40, -28, 28, 40)):
        sphere(f"fd_tree{k}", 4.5, (x, 30, 6), M("bush", "#3f8f3a", 0.9), (1, 1, 1.2), coll=c)
    return dict(coll=c)


def farm_set():
    c = collection("FARM")
    W.sky(1.0)
    W.sun(4.0, rot=(45, 0, -30), coll=c)
    box("fm_grass", (300, 300, 0.4), (0, 0, -0.2), M("grass", "#6cbc4a", 0.9), 0, coll=c)
    mud = cyl("fm_mud", 9.0, 0.3, (0, 2, 0.0), M("mud", "#5a3a22", 0.18, coat=0.6), 40, coll=c)
    rnd = random.Random(5)
    for i in range(10):
        sphere(f"fm_lump{i}", rnd.uniform(0.6, 1.2), (rnd.uniform(-6, 6), 2 + rnd.uniform(-6, 6), 0.05),
               M("mud_dk", "#4a2e1a", 0.3, coat=0.5), (1.4, 1.2, 0.3), coll=c, seg=12)
    Mw = M("fence_wood", "#c89a6a", 0.7)
    for i in range(14):
        x = -20 + i * 3
        box(f"fm_post{i}", (0.4, 0.4, 3.0), (x, 14, 1.5), Mw, 0.05, coll=c)
    for z in (1.2, 2.4):
        box(f"fm_rail{z}", (42, 0.25, 0.35), (0, 14, z), Mw, 0.05, coll=c)
    box("fm_barn", (16, 12, 12), (-12, 30, 6), M("barn_red", "#c0392b", 0.7), 0.1, coll=c)
    poly_extrude("fm_barnroof", [(-8.6, 0), (8.6, 0), (0, 6)], 12.6, (-12, 36.3, 12), M("barn_roof", "#4a3a3a", 0.7),
                 rot=(90, 0, 0), coll=c)
    card("fm_barndoor", 6, 7, (-12, 23.95, 3.5), M("barn_door", "#f4f0e6", 0.6), "-Y", coll=c)
    for k, x in enumerate((14, 24, 34)):
        sphere(f"fm_tree{k}", 4.0, (x, 26, 6), M("bush", "#3f8f3a", 0.9), (1, 1, 1.2), coll=c)
    return dict(coll=c)


def museum_set():
    c = collection("MUSEUM")
    world((0.95, 0.9, 0.8), 0.45)
    box("mu_floor", (80, 80, 0.4), (0, 10, -0.2), checker_mat("mu_floor", "#ece6da", "#c9bfae", 0.18), 0, coll=c)
    Mw = M("mu_wall", "#e9dcc4", 0.85)
    box("mu_back", (80, 0.5, 30), (0, 26, 15), Mw, 0, coll=c)
    box("mu_left", (0.5, 80, 30), (-24, 10, 15), Mw, 0, coll=c)
    box("mu_right", (0.5, 80, 30), (24, 10, 15), Mw, 0, coll=c)
    Mc = M("mu_col", "#f4f0e6", 0.5)
    for x in (-18, -6, 6, 18):
        cyl(f"mu_col{x}", 1.0, 24, (x, 24, 12), Mc, 24, coll=c)
        box(f"mu_colcap{x}", (2.8, 2.8, 0.8), (x, 24, 24.2), Mc, 0.1, coll=c)
    label("mu_sign", "MUSEUM OF FOSSILS", (0, 25.6, 20), 2.2, "#7a5a2a", extrude=0.1)
    for k, x in enumerate((-16, 16)):
        card(f"mu_banner{k}", 4, 10, (x, 25.7, 12), M("mu_banner" + str(k), ["#2a5ad0", "#c0392b"][k], 0.6), "-Y", coll=c)
    # rope barrier
    Mg = M("gold", "#e2b23a", 0.3, metal=0.9)
    for x in (-9, -3, 3, 9):
        cyl(f"mu_post{x}", 0.18, 2.4, (x, -1, 1.2), Mg, 12, coll=c)
    for x in (-6, 0, 6):
        cyl(f"mu_rope{x}", 0.1, 6, (x, -1, 1.9), M("rope_red", "#a8241e", 0.6), 8, coll=c, rot=(0, 90, 0))
    light("mu_key", "AREA", (0, -8, 22), 16000, (1.0, 0.95, 0.85), 20, coll=c, target=(0, 8, 2))
    light("mu_spot", "SPOT", (-6, 2, 20), 9000, (1.0, 0.9, 0.7), 1.0, coll=c, target=(-4, 4, 2), spot=35)
    light("mu_fill", "AREA", (14, -6, 10), 3000, (0.9, 0.95, 1.0), 8, coll=c, target=(0, 8, 4))
    return dict(coll=c)


PED = (-4.0, 4.0)


def pedestal(fossil=True):
    box("ped", (4.0, 4.0, 2.0), (PED[0], PED[1], 1.0), M("ped_marble", "#f4f2ee", 0.3), 0.1)
    box("ped_plaque", (2.6, 0.12, 0.8), (PED[0], PED[1] - 2.06, 1.2), M("gold", "#e2b23a", 0.3, metal=0.9), 0.03)
    label("ped_txt", "GRANDPA", (PED[0], PED[1] - 2.14, 1.2), 0.42, "#3a2a10", extrude=0.01)
    return (PED[0], PED[1], 2.0)


def hall():
    h = W.hallway_day()
    for k, y in enumerate((0, 14, 28, 42)):
        light(f"hall_l{k}", "AREA", (0, y, 11.4), 2600, (1.0, 0.97, 0.92), 5, target=(0, y, 0), size_y=8)
    light("hall_front", "AREA", (0, -4, 7), 1800, (1.0, 0.97, 0.92), 6, target=(0, 10, 4))
    world((0.85, 0.85, 0.9), 0.4)
    return h


def lockers_label():
    pass


# ================================================================== HOOK (0-3.7s)
@S(1, 0, 4, "HOOK: balloon-headed chicken floats over the burning house, camera dives")
def s01(t0, t1):
    fire_house(t0, t1)
    p = (0, 0, 17.0)
    C = chicken("ch", p, 1.0, rot=10, balloon=True)
    keyloc(C["root"], t0, p)
    keyloc(C["root"], t1, (0.4, 0.6, 17.6))
    flap(C, t0, t1, 7, 50)
    cam = Cam()
    cam.key(t0, (6, -20, 26), up(p, 3.0), lens=24, roll=-8, focus=up(p, 3), fstop=4)
    cam.key(t1, (2.5, -9, 19.5), up(p, 3.2), lens=30, roll=3, focus=up(p, 3), fstop=4, ease="EASE_OUT")
    cam.handheld(1.4)
    sfx(t0, "whoosh", 0.9)
    sfx(t0, "fire", 0.8, dur=V.w(11))


@S(2, 4, 6, "...life: the narrator, firelit, mouth open, crash zoom")
def s02(t0, t1):
    fire_house(t0, t1, smoke=False)
    H = hero(t0, t1, "shout")
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0, "fists", 0.8)
    lips(H, t0, t1, "shout")
    look_at(H, t0, (0, 0, 16))
    cam = Cam()
    tg = up(HERO_P, 4.7)
    cam.push(t0, t1, tg, 6.5, 4.2, yaw=170, pitch=-6, lens=26, yaw1=178, look=up(HERO_P, 4.3))
    cam.crash(t0 + 0.05, 22, 30, 0.1)
    cam.handheld(1.6)
    sfx(t0, "whoosh", 0.6)


@S(3, 6, 9, "calling her an: low angle, hands cupped, yelling up at the sky")
def s03(t0, t1):
    fire_house(t0, t1, smoke=True)
    H = hero(t0, t1, "shout")
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0, "fists", 1.0)
    H.pose(t0, head=(0, -22, 0), torso=(0, -8, 0))
    lips(H, t0, t1, "shout")
    cam = Cam()
    tg = up(HERO_P, 4.6)
    cam.key(t0, (HERO_P[0] - 3.0, HERO_P[1] + 5.0, 1.6), tg, lens=22, roll=-10, focus=tg, fstop=3)
    cam.key(t1, (HERO_P[0] - 2.2, HERO_P[1] + 4.2, 1.4), tg, lens=24, roll=-4, focus=tg, fstop=3)
    cam.handheld(1.4)


@S(4, 9, 10, "airhead: falling chicken, POOMP, the head inflates into a giant balloon")
def s04(t0, t1):
    fire_house(t0, t1, smoke=True)
    p0, p1 = (0, 1.0, 16.5), (0, 1.0, 15.6)
    C = chicken("ch", p0, 1.0, rot=-15)
    keyloc(C["root"], t0, p0)
    ti = t0 + 0.18
    keyloc(C["root"], ti, p1)
    keyloc(C["root"], t1, (0, 1.0, 16.4))
    flap(C, t0, t1, 9, 70)
    inflate(C, ti)
    flash(ti, 1.2, 0.2)
    cam = Cam()
    cam.push(t0, t1, up(p1, 3.2), 9.5, 7.5, yaw=10, pitch=4, lens=24)
    cam.crash(ti, 24, 18, 0.1)
    cam.handheld(2.0)
    sfx(ti, "inflate")
    sfx(ti + 0.12, "pop", 0.6)


@S(5, 10, 11, "Literally.: balloon chicken drifting, dead-pan blink, slow orbit")
def s05(t0, t1):
    fire_house(t0, t1, smoke=True)
    p = (0, 1.0, 16.6)
    C = chicken("ch", p, 1.0, rot=0, balloon=True)
    keyloc(C["root"], t0, p)
    keyloc(C["root"], t1, up(p, 0.5))
    flap(C, t0, t1, 3, 25)
    cam = Cam()
    cam.orbit(t0, t1, up(p, 4.3), 8.0, -22, 12, pitch=6, lens=34, steps=3, fstop=3)
    cam.handheld(0.8)
    sfx(t0 + 0.1, "rimshot", 0.5)


# ================================================================== THE RULE (3.7-11s)
@S(6, 11, 16, "You see, in this world: crane down over the sunny town to a kid on the street")
def s06(t0, t1):
    street_day()
    B = kidc(1, t0, t1, "smug")
    K = kidc(4, t0, t1, "happy")
    pb, pk = (-2.2, -30, 0), (2.2, -30, 0)
    B.pose(t0, loc=pb, rot=-60)
    K.pose(t0, loc=pk, rot=60)
    cam = Cam()
    cam.key(t0, (10, -70, 46), (0, -24, 0), lens=30, focus=50.0, fstop=16)
    cam.key(t1, (3, -45, 8), (0, -30, 4), lens=26, focus=15.0, fstop=8, ease="EASE_IN_OUT")
    cam.handheld(0.8)
    sfx(t0, "whoosh", 0.7)
    sfx(t0, "kids_laugh", 0.25, dur=t1 - t0)


@S(7, 16, 18, "every insult: a kid points and yells BANANA BRAIN!")
def s07(t0, t1):
    street_day()
    B = kidc(1, t0, t1, "shout")
    K = kidc(4, t0, t1, "happy")
    pb, pk = (-2.2, -30, 0), (2.2, -30, 0)
    B.pose(t0, loc=pb, rot=-60)
    K.pose(t0, loc=pk, rot=60)
    B.act(t0 + 0.05, "point", 1.0, expr="shout")
    lips(B, t0, t1, "shout")
    shout("bub", "BANANA\nBRAIN!", (-2.3, -31.5, 6.9), t0 + 0.06, size=0.45, yaw=0)
    cam = Cam()
    cam.push(t0, t1, up(pb, 4.4), 8.5, 7.0, yaw=-30, pitch=6, lens=26, look=up(pb, 5.0))
    cam.handheld(1.2)


@S(8, 18, 20, "comes true.: the other kid gasps, push in")
def s08(t0, t1):
    street_day()
    K = kidc(4, t0, t1, "gasp")
    pk = (2.2, -30, 0)
    K.pose(t0, loc=pk, rot=60)
    K.act(t0 + 0.05, "recoil", 0.8, expr="gasp")
    cam = Cam()
    cam.push(t0, t1, up(pk, 4.6), 6.0, 4.2, yaw=40, pitch=4, lens=28, look=up(pk, 4.2))
    cam.handheld(1.0)
    sfx(t0 + 0.05, "gasp", 0.7)


@S(9, 20, 21, "Poof!: his head turns into a banana")
def s09(t0, t1):
    street_day()
    K = kidc(4, t0, t1, "gasp")
    pk = (2.2, -30, 0)
    K.pose(t0, loc=pk, rot=40)
    tp = t0 + 0.06
    vis(K.head, [(tp, False)])
    bn = banana_head(K)
    vis(bn, [(tp, True)])
    W2.poof("pf", up(pk, 4.8), tp, 0.7)
    K.act(tp + 0.05, "shock", 1.0)
    cam = Cam()
    cam.push(t0, t1, up(pk, 4.6), 7.5, 6.5, yaw=30, pitch=4, lens=26)
    cam.crash(tp, 26, 34, 0.08)
    cam.handheld(1.8)
    sfx(tp, "poof")


@S(10, 21, 26, "And it stays that way: banana-head kid walks sadly, people point and laugh")
def s10(t0, t1):
    street_day()
    K = kidc(4, t0, t1, "worried")
    vis(K.head, [(t0 - 1, False)])
    banana_head(K)
    K.walk(t0, t1, (-3, -31, 0), (1.5, -31, 0), rate=1.6, swing=22, arm=18)
    K.pose(t0, torso=(0, 12, 0))
    for k, (x, rot) in enumerate(((-6.5, 30), (6, -40))):
        T = kidc(5 + k, t0, t1, "joy")
        T.pose(t0, loc=(x, -27, 0), rot=rot)
        laugh(T, t0, t1, rate=5)
        T.act(t0 + 0.1, "point" if k == 0 else "point_l", 0.9)
    cam = Cam()
    cam.key(t0, (-6, -44, 5), (-2, -30, 3.6), lens=28, focus=14.0, fstop=6)
    cam.key(t1, (2, -43, 5), (1.0, -30, 3.6), lens=28, focus=13.0, fstop=6)
    cam.handheld(0.9)
    sfx(t0 + 0.1, "kids_laugh", 0.5)


@S(11, 26, 30, "until you say sorry: SORRY! poof, head back, high five")
def s11(t0, t1):
    street_day()
    B = kidc(1, t0, t1, "worried")
    K = kidc(4, t0, t1, "worried")
    pb, pk = (-2.2, -30, 0), (2.2, -30, 0)
    B.pose(t0, loc=pb, rot=-60)
    K.pose(t0, loc=pk, rot=60)
    tsay = w(28)
    B.act(tsay, "shrug", 0.9, expr="talk")
    lips(B, tsay, t1)
    shout("bub", "SORRY!", (-0.8, -31, 7.0), tsay, size=0.55)
    tp = w(29) + 0.08
    vis(K.head, [(tp, True)])
    bn = banana_head(K)
    vis(bn, [(tp, False)])
    W2.poof("pf", up(pk, 4.8), tp, 0.7)
    K.face(tp + 0.05, "joy")
    K.act(tp + 0.1, "cheer", 0.9)
    B.face(tp + 0.1, "happy")
    cam = Cam()
    mid = (0, -30, 4.4)
    cam.push(t0, t1, mid, 11.0, 8.5, yaw=-6, pitch=6, lens=26, yaw1=6)
    cam.crash(tp, 26, 30, 0.1)
    cam.handheld(1.0)
    sfx(tp, "poof")
    sfx(tp + 0.15, "sparkle", 0.6)


@S(12, 30, 33, "So everybody is: street, people waving and bowing to each other")
def s12(t0, t1):
    street_day()
    rnd = random.Random(3)
    for k in range(6):
        T = kidc(k, t0, t1, "smile")
        p = (-9 + k * 3.6, -28 - (k % 2) * 4, 0)
        T.pose(t0, loc=p, rot=(1 if k % 2 else -1) * 70)
        T.act(t0 + 0.05 * k, "wave", 0.9)
        wiggle = acting.wiggle(T, t0, t1, "armR", (25, 10), 6, (165, 25))
    cam = Cam()
    cam.key(t0, (-12, -46, 9), (0, -29, 3), lens=26, focus=17.0, fstop=8)
    cam.key(t1, (-6, -44, 6), (0, -29, 3.5), lens=28, focus=15.0, fstop=8)
    cam.handheld(0.7)
    sfx(t0, "chat", 0.4, dur=t1 - t0)


@S(13, 33, 35, "super polite.: two kids bow deeply, sparkles")
def s13(t0, t1):
    street_day()
    A = kidc(2, t0, t1, "smile")
    B = kidc(6, t0, t1, "smile")
    pa, pb = (-1.8, -30, 0), (1.8, -30, 0)
    A.pose(t0, loc=pa, rot=-90)
    B.pose(t0, loc=pb, rot=90)
    for ch in (A, B):
        ch.act(t0 + 0.05, "wave", 0.7)
        ch.nod(t0 + 0.15, n=2, amp=22)
        ch.face(t0 + 0.3, "relief")
    cam = Cam()
    cam.key(t0, (7, -44, 6), (0, -30, 3.2), lens=28, focus=15.0, fstop=8)
    cam.key(t1, (4, -42, 5), (0, -30, 3.0), lens=30, focus=12.5, fstop=8)
    cam.handheld(0.8)
    sfx(t0 + 0.4, "sparkle", 0.6)


@S(14, 35, 38, "Teachers never call: classroom, the teacher at the board")
def s14(t0, t1):
    cr = W.classroom_day(board="chalkboard.png")
    T = teacher(t0, t1, "smile")
    tp = (-5.0, 11.0, 0)
    T.pose(t0, loc=tp, rot=10)
    T.act(t0 + 0.05, "point_l", 0.6)
    lips(T, t0, t1)
    cam = Cam()
    cam.key(t0, (-1.0, 1.0, 5.5), up(tp, 4.4), lens=24, focus=up(tp, 4.4), fstop=4)
    cam.key(t1, (-2.5, 4.0, 5.0), up(tp, 4.5), lens=26, focus=up(tp, 4.5), fstop=4)
    cam.handheld(0.8)
    sfx(t0, "whoosh", 0.5)


@S(15, 38, 40, "anyone lazy: a kid asleep on his desk, Zzz, teacher clamps her mouth")
def s15(t0, t1):
    cr = W.classroom_day(board="chalkboard.png")
    K = kidc(3, t0, t1, "sleepy")
    W.sit(K, t0, E_DESK, head=(0, 30, 0), torso=(0, 25, 0))
    K.face(t0, eyes="closed", mouth="wavy")
    sp = W.seat_pos(E_DESK)
    for k in range(3):
        z = label(f"zz{k}", "Z", (sp[0] + 0.6 + k * 0.45, sp[1] + 1.0, 5.6 + k * 0.6), 0.5 + 0.15 * k, "#ffffff",
                  rot=(90, 0, 180), extrude=0.03)
        pop_in(z, t0 + 0.1 + k * 0.15, 1.0)
    T = teacher(t0, t1, "shock")
    tp = (-1.0, 11.0, 0)
    T.pose(t0, loc=tp, rot=15)
    T.act(t0 + 0.15, "hands_face", 1.0, expr="worried")
    cam = Cam()
    tg = (sp[0], sp[1] + 0.5, 4.0)
    cam.key(t0, (sp[0] + 3.5, sp[1] + 6.0, 6.5), tg, lens=26, focus=tg, fstop=3)
    cam.key(t1, (sp[0] + 2.6, sp[1] + 5.0, 6.0), tg, lens=28, focus=tg, fstop=3)
    cam.handheld(0.8)
    sfx(t0 + 0.1, "snort", 0.5)


@S(16, 40, 44, "or the kid would: close on the sleepy face, eyes half open")
def s16(t0, t1):
    cr = W.classroom_day(board="chalkboard.png")
    K = kidc(3, t0, t1, "sleepy")
    W.sit(K, t0, E_DESK, head=(0, 10, 0), torso=(0, 10, 0))
    K.face(t0 + 0.2, "yawn")
    sp = W.seat_pos(E_DESK)
    tg = (sp[0], sp[1], 4.6)
    cam = Cam()
    cam.key(t0, (sp[0] - 1.0, sp[1] + 4.6, 5.6), tg, lens=30, focus=tg, fstop=2.8)
    cam.key(t1, (sp[0] - 0.4, sp[1] + 3.6, 5.2), tg, lens=32, focus=tg, fstop=2.8)
    cam.handheld(0.8)


@S(17, 44, 48, "melt into the chair: the kid melts into a puddle on the seat")
def s17(t0, t1):
    cr = W.classroom_day(board="chalkboard.png")
    K = kidc(3, t0, t1, "sleepy")
    W.sit(K, t0, E_DESK)
    sp = W.seat_pos(E_DESK)
    tm = t0 + 0.08
    r = K.root
    keyscale(r, tm, 1.0)
    keyscale(r, tm + 0.35, (1.25, 1.25, 0.55))
    keyscale(r, t1, (1.7, 1.7, 0.18))
    for tt, sz in ((tm, 1.0), (tm + 0.35, 0.55), (t1, 0.18)):
        keyloc(r, tt, (sp[0], sp[1], 2.3 - 2.0 * sz))
    K.face(tm, eyes="half", mouth="wavy")
    pud = sphere("puddle", 1.0, (sp[0], sp[1], 2.25), M("puddle_kid", "#f2c14e", 0.15, coat=0.8), (0.1, 0.1, 0.1), seg=20)
    keyscale(pud, tm, (0.05, 0.05, 0.05))
    keyscale(pud, t1, (1.6, 1.6, 0.25))
    for k in range(4):
        d = sphere(f"drip{k}", 0.16, (sp[0] - 0.8 + k * 0.5, sp[1] - 0.7, 2.0), M("puddle_kid", "#f2c14e", 0.15), (1, 1, 1.6), seg=10)
        keyloc(d, tm + 0.2 + k * 0.1, (sp[0] - 0.8 + k * 0.5, sp[1] - 0.7, 2.0))
        keyloc(d, tm + 0.6 + k * 0.1, (sp[0] - 0.8 + k * 0.5, sp[1] - 0.7, 0.1))
    tg = (sp[0], sp[1], 3.0)
    cam = Cam()
    cam.key(t0, (sp[0] + 4.0, sp[1] + 6.5, 6.2), tg, lens=26, focus=tg, fstop=4)
    cam.key(t1, (sp[0] + 2.0, sp[1] + 5.0, 4.6), (sp[0], sp[1], 2.4), lens=28, focus=tg, fstop=4)
    cam.handheld(1.0)
    sfx(tm + 0.05, "melt")
    sfx(tm + 0.5, "splat", 0.6)


@S(18, 48, 51, "Football coaches never: sunny field, coach with whistle")
def s18(t0, t1):
    field_set()
    Cc = coach(t0, t1, "smile")
    cp = (0, 0, 0)
    Cc.pose(t0, loc=cp, rot=0)
    Cc.act(t0 + 0.05, "cross", 0.8)
    for k in range(4):
        Kd = kidc(k, t0, t1, "happy")
        Kd.run(t0, t1, (-14 + k * 2, 12 + k * 2.5, 0), (14 + k * 2, 12 + k * 2.5, 0))
    cam = Cam()
    cam.key(t0, (6, -14, 3.0), up(cp, 4.2), lens=22, focus=up(cp, 4.2), fstop=5)
    cam.key(t1, (2.5, -10, 4.0), up(cp, 4.6), lens=26, focus=up(cp, 4.6), fstop=5)
    cam.handheld(0.8)
    sfx(t0, "whistle", 0.5)


@S(19, 51, 54, "yell, You're slow!: coach chokes it back, hands over mouth, bubble crossed out")
def s19(t0, t1):
    field_set()
    Cc = coach(t0, t1, "shout")
    cp = (0, 0, 0)
    Cc.pose(t0, loc=cp, rot=0)
    lips(Cc, t0, w(52) + 0.1, "shout")
    Cc.act(t0, "fists", 0.8)
    tx = w(53) + 0.15
    Cc.act(tx, "hands_face", 1.0, expr="scared")
    bub = shout("bub", "YOU'RE\nSL...", (0.5, -0.8, 8.2), w(52), size=0.6)
    xr = empty("xmark", (0.5, -1.3, 8.6))
    for a in (45, -45):
        box(f"x{a}", (5.0, 0.2, 0.55), (0, 0, 0), M("x_red", "#e8322a", 0.4, emit=hexc("#e8322a"), estr=1.5), 0.1, parent=xr,
            rot=(0, a, 0))
    pop_in(xr, tx, 1.0, 1.4)
    cam = Cam()
    cam.push(t0, t1, up(cp, 5.6), 9.0, 7.0, yaw=8, pitch=4, lens=26, look=up(cp, 5.8))
    cam.crash(tx, 26, 32, 0.08)
    cam.handheld(1.2)
    sfx(tx, "buzzer", 0.6)


@S(20, 54, 58, "Because the whole team: team of kids sprinting toward camera")
def s20(t0, t1):
    field_set()
    for k in range(6):
        Kd = kidc(k, t0, t1, "happy")
        x = -7.5 + k * 3
        Kd.run(t0, t1, (x, 16 + (k % 2) * 3, 0), (x, 2 + (k % 2) * 3, 0))
    cam = Cam()
    cam.key(t0, (0, -10, 3.0), (0, 10, 3.0), lens=24, focus=18.0, fstop=6)
    cam.key(t1, (0, -8, 2.6), (0, 6, 3.4), lens=24, focus=10.0, fstop=6)
    cam.handheld(1.3)
    sfx(t0, "footsteps", 0.6, dur=t1 - t0)


@S(21, 58, 62, "would turn into turtles: poof poof poof, turtles crawl slowly")
def s21(t0, t1):
    field_set()
    tp = w(59)
    cols = [chars.KID_COLORS[k][0] for k in range(6)]
    for k in range(6):
        x = -7.5 + k * 3
        p = (x, 4 + (k % 2) * 3, 0)
        Kd = kidc(k, t0, t1, "gasp")
        Kd.run(t0, tp, (x, 6 + (k % 2) * 3, 0), p)
        ti = tp + 0.07 * k
        W2.vanish(Kd, ti)
        tu = turtle(f"tur{k}", p, 1.1, rot=0, jersey=cols[k])
        vis(tu, [(ti, True)])
        keyloc(tu, ti, p, "LINEAR")
        keyloc(tu, t1, (x, p[1] - 0.6, 0), "LINEAR")
        W2.poof(f"pf{k}", up(p, 3.4), ti, 0.8, seed=k)
        sfx(ti, "poof", 0.8)
    cam = Cam()
    cam.key(t0, (2, -8, 4.0), (0, 6, 2.0), lens=24, focus=12.0, fstop=6)
    cam.key(t1, (3, -4, 6.0), (0, 5, 1.0), lens=26, focus=9.0, fstop=6)
    cam.crash(tp, 24, 30, 0.1)
    cam.handheld(1.2)
    sfx(t1 - 0.4, "aww", 0.35)


@S(22, 62, 68, "And if you call someone a: hallway, a bully sneers at a kid")
def s22(t0, t1):
    hall()
    B = bully(1, t0, t1, "smug")
    K = kidc(7, t0, t1, "worried")
    pb, pk = (-1.8, 10, 0), (1.8, 10, 0)
    B.pose(t0, loc=pb, rot=-70)
    K.pose(t0, loc=pk, rot=70)
    B.act(t0 + 0.4, "point", 0.9, expr="shout")
    lips(B, t0 + 0.4, t1, "shout")
    cam = Cam()
    mid = (0, 10, 4.4)
    cam.push(t0, t1, mid, 11.0, 8.0, yaw=-15, pitch=5, lens=26)
    cam.handheld(1.0)


@S(23, 68, 71, "pig at school: poof, snout + ears, he oinks")
def s23(t0, t1):
    hall()
    K = kidc(7, t0, t1, "gasp")
    pk = (1.8, 10, 0)
    K.pose(t0, loc=pk, rot=40)
    shout("bub", "PIG!", (-0.8, 9.0, 8.2), t0, size=0.8, yaw=-10)
    tp = t0 + 0.2
    pg = pig_bits(K)
    vis(pg, [(tp, True)])
    W2.poof("pf", up(pk, 4.8), tp, 0.7)
    K.act(tp + 0.05, "hands_face", 0.9, expr="shock")
    cam = Cam()
    cam.push(t0, t1, up(pk, 4.6), 6.0, 4.6, yaw=-20, pitch=4, lens=28)
    cam.crash(tp, 28, 34, 0.08)
    cam.handheld(1.4)
    sfx(tp, "poof")
    sfx(tp + 0.25, "oink", 0.8)


@S(24, 71, 75, "you'd better have a: pig kid looks around nervously")
def s24(t0, t1):
    hall()
    K = kidc(7, t0, t1, "worried")
    pk = (1.8, 10, 0)
    K.pose(t0, loc=pk, rot=20)
    pig_bits(K)
    look_at(K, t0 + 0.1, (-8, 0, 5))
    look_at(K, t0 + 0.45, (8, 0, 5))
    K.face(t0 + 0.45, "side_r")
    cam = Cam()
    cam.orbit(t0, t1, up(pk, 4.6), 5.0, 10, -20, pitch=4, lens=30, steps=3)
    cam.handheld(1.0)


@S(25, 75, 78, "muddy field nearby: the pig kid belly-flops into mud, splash")
def s25(t0, t1):
    farm_set()
    K = kidc(7, t0, t1, "joy")
    pig_bits(K)
    p0, p1 = (-6, -4, 0), (0, 2, -0.6)
    K.pose(t0, loc=p0, rot=-40)
    tj = t0 + 0.35
    K.pose(tj, loc=(-3, -1, 3.0), rot=-40, torso=(0, 50, 0), armL=(170, 20), armR=(170, 20))
    K.pose(tj + 0.3, loc=p1, rot=-40, torso=(0, 80, 0))
    rnd = random.Random(2)
    for i in range(14):
        d = sphere(f"mud{i}", rnd.uniform(0.2, 0.45), (0, 2, 0.3), M("mud_dk", "#4a2e1a", 0.3, coat=0.5), seg=8)
        a = i / 14 * math.tau
        keyscale(d, tj + 0.28, 0.01)
        keyloc(d, tj + 0.3, (0, 2, 0.3))
        keyscale(d, tj + 0.32, 1.0)
        keyloc(d, tj + 0.6, (math.cos(a) * 4, 2 + math.sin(a) * 4, rnd.uniform(3, 5)))
        keyloc(d, tj + 0.95, (math.cos(a) * 6, 2 + math.sin(a) * 6, 0.1))
    cam = Cam()
    cam.key(t0, (-12, -16, 6), (-3, 0, 2.5), lens=24, focus=14.0, fstop=6)
    cam.key(t1, (-6, -12, 4.5), (0, 2, 1.5), lens=26, focus=13.0, fstop=6)
    cam.handheld(1.2)
    sfx(tj + 0.3, "splat")
    sfx(tj + 0.4, "oink", 0.7)


# ================================================================== GRANDPA (22-31s)
@S(26, 78, 82, "I haven't insulted anyone: the narrator zips his lips")
def s26(t0, t1):
    hall()
    H = hero(t0, t1, "smug", short=True)
    p = (0, 8, 0)
    H.pose(t0, loc=p, rot=0)
    H.act(t0 + 0.1, "think", 0.8)
    H.face(t0 + 0.1, eyes="half", mouth="flat")
    tz = w(80)
    H.act(tz, "facepalm", 0.4)
    H.pose(tz, armR=(140, -10), head=(0, 4, 0))
    H.pose(tz + 0.3, armR=(140, 30))
    H.face(tz + 0.3, eyes="closed", mouth="flat")
    cam = Cam()
    cam.push(t0, t1, up(p, 4.6), 7.0, 4.8, yaw=-12, pitch=3, lens=28, yaw1=6, look=up(p, 4.3))
    cam.handheld(0.9)
    sfx(tz + 0.3, "zip")


@S(27, 82, 86, "since I was five: tiny narrator in the living room with a toy truck")
def s27(t0, t1):
    lr = locs.living_room()
    H = hero(t0, t1, "happy", glasses=False, L=False, scale=0.62, name="Tiny")
    p = (3.0, -1.5, 0)
    H.pose(t0, loc=p, rot=30)
    H.act(t0, "wave", 0.6)
    acting.wiggle(H, t0, t1, "armR", (25, 10), 5, (160, 25))
    tr = empty("toy", (1.5, -2.5, 0))
    box("toy_body", (1.0, 0.6, 0.5), (0, 0, 0.45), M("toy_red", "#e8463a", 0.4), 0.1, parent=tr)
    for sx in (-1, 1):
        cyl(f"toy_wh{sx}", 0.18, 0.7, (sx * 0.3, 0, 0.18), M("tire", "#151515", 0.8), 12, parent=tr, rot=(90, 0, 0))
    cam = Cam()
    cam.key(t0, (6, -9, 3.0), up(p, 2.6), lens=26, focus=up(p, 2.6), fstop=3.5)
    cam.key(t1, (5, -6.5, 2.6), up(p, 2.8), lens=28, focus=up(p, 2.8), fstop=3.5)
    cam.handheld(0.8)
    sfx(t0, "kids_laugh", 0.35)


@S(28, 86, 91, "That year, I called my: grandpa naps on the couch, tiny me points")
def s28(t0, t1):
    lr = locs.living_room()
    G = grandpa(t0, t1, "smile")
    gp = (0, 6.2, 0.3)
    G.pose(t0, loc=gp, rot=0, legL=(85, 3), legR=(85, -3), armL=(10, 10), armR=(10, 10))
    H = hero(t0, t1, "smug", glasses=False, L=False, scale=0.62, name="Tiny")
    p = (3.0, -2.5, 0)
    H.pose(t0, loc=p, rot=160)
    H.act(w(89), "point", 1.0, expr="shout")
    lips(H, w(89), t1, "shout")
    cam = Cam()
    cam.key(t0, (-5, -8, 5.0), (1.5, 4, 3.5), lens=24, focus=10.0, fstop=4)
    cam.key(t1, (-3, -6, 4.4), (1.8, 4, 3.6), lens=26, focus=9.0, fstop=4)
    cam.handheld(0.8)


@S(29, 91, 95, "grandpa an old fossil: OLD FOSSIL! poof, grandpa turns to bone and stone")
def s29(t0, t1):
    lr = locs.living_room()
    gp = (0, 6.2, 0.3)
    G = grandpa(t0, t1, "smile")
    G.pose(t0, loc=gp, rot=0, legL=(85, 3), legR=(85, -3), armL=(10, 10), armR=(10, 10))
    Fo = grandpa(t0, t1, "shock", fossil=True)
    Fo.pose(t0, loc=gp, rot=0, legL=(85, 3), legR=(85, -3), armL=(35, 55), armR=(35, 55))
    shout("bub", "OLD\nFOSSIL!", (2.6, 1.0, 7.6), w(93), size=0.5)
    tp = w(94) + 0.1
    W2.vanish(G, tp)
    vis(tree(Fo.root), [(tp, True)])
    W2.poof("pf", up(gp, 4.2), tp, 0.9)
    cam = Cam()
    cam.push(t0, t1, up(gp, 4.4), 8.0, 6.0, yaw=-8, pitch=4, lens=26)
    cam.crash(tp, 26, 34, 0.08)
    cam.handheld(1.2)
    sfx(tp, "poof")
    sfx(tp + 0.1, "stone", 0.8)


@S(30, 95, 102, "and he spent a week in the: museum hall, crane down on the fossil grandpa on a pedestal")
def s30(t0, t1):
    museum_set()
    top = pedestal()
    Fo = grandpa(t0, t1, "neutral", fossil=True)
    Fo.pose(t0, loc=top, rot=10)
    trex("rex", (8, 10, 0), 1.0, rot=15)
    cam = Cam()
    cam.key(t0, (-2, -22, 20), (0, 6, 4), lens=22, focus=26.0, fstop=8)
    cam.key(t1, (-4, -14, 9), up(top, 3.5), lens=24, focus=18.0, fstop=6)
    cam.handheld(0.7)
    sfx(t0, "whoosh", 0.6)
    sfx(t0 + 0.2, "chat", 0.25, dur=t1 - t0)


@S(31, 102, 107, "museum next to a T-Rex: whip to the giant skeleton, roar")
def s31(t0, t1):
    museum_set()
    top = pedestal()
    Fo = grandpa(t0, t1, "smile", fossil=True)
    Fo.pose(t0, loc=top, rot=20)
    rx = trex("rex", (8, 10, 0), 1.0, rot=15)
    tw = w(105)
    jaw = bpy.data.objects["rex_jaw"]
    keyrot(jaw, tw + 0.1, (0, -10, 0))
    keyrot(jaw, tw + 0.25, (0, -35, 0))
    keyrot(jaw, t1, (0, -30, 0))
    cam = Cam()
    cam.key(t0, (-8, -8, 6), up(top, 3.8), lens=26, focus=up(top, 3.8), fstop=4)
    cam.whip(tw - 0.12, tw + 0.05, (-8, -8, 6), up(top, 3.8), (-4, -10, 8), (6, 10, 8), lens=22)
    cam.key(t1, (-3, -11, 7), (5, 10, 8.5), lens=22, focus=20.0, fstop=6)
    cam.handheld(1.0)
    sfx(tw + 0.1, "roar", 0.8)


@S(32, 107, 111, "He liked it there: fossil grandpa grins as tourists' cameras flash")
def s32(t0, t1):
    museum_set()
    top = pedestal()
    Fo = grandpa(t0, t1, "grin", fossil=True)
    Fo.pose(t0, loc=top, rot=0)
    Fo.act(t0 + 0.1, "cheer", 0.6)
    trex("rex", (8, 10, 0), 1.0, rot=15)
    for k in range(3):
        T = kidc(k + 2, t0, t1, "happy")
        tp = ([-9.5, -7.0, 0.8][k], -1.8, 0)
        T.pose(t0, loc=tp, rot=180 + (k - 1) * 15)
        T.act(t0, "phone", 0.9)
        lt = light(f"camflash{k}", "POINT", up(tp, 5.5), 0, (1, 1, 1), 0.5)
        for tf in (t0 + 0.2 + k * 0.25, t0 + 0.75 + k * 0.2):
            lt.data.energy = 0
            lt.data.keyframe_insert("energy", frame=F(tf) - 1)
            lt.data.energy = 6000
            lt.data.keyframe_insert("energy", frame=F(tf))
            lt.data.energy = 0
            lt.data.keyframe_insert("energy", frame=F(tf) + 2)
            sfx(tf, "click", 0.6)
    cam = Cam()
    cam.push(t0, t1, up(top, 4.6), 9.0, 6.5, yaw=10, pitch=6, lens=26)
    cam.handheld(0.8)


@S(33, 111, 113, "Too much.: security tries to pull him off, he hugs the T-Rex leg")
def s33(t0, t1):
    museum_set()
    rx = trex("rex", (8, 10, 0), 1.0, rot=15)
    Fo = grandpa(t0, t1, "angry", fossil=True)
    gp = (7.6, 8.2, 0)
    Fo.pose(t0, loc=gp, rot=140, armL=(100, -30), armR=(100, -30))
    Fo.face(t0, eyes="angry", mouth="grimace")
    G2 = chars.Char("Guard", skin="#a8714a", shirt="#2a3a6a", pants="#1e2440", hair="cap", hair_color="#1e2440",
                    face="plain", extras=("collar:#f4f4f4",))
    story._live(G2, t0, t1, "worried")
    gg = (5.8, 6.0, 0)
    G2.pose(t0, loc=gg, rot=140, armL=(90, 0), armR=(90, 0), torso=(0, -15, 0))
    noise(G2.root, "location", 0, 0.08, 4)
    Fo.shake(t0 + 0.1, n=4, amp=14)
    cam = Cam()
    cam.push(t0, t1, (7.0, 7.5, 4.2), 11, 9, yaw=-25, pitch=8, lens=24)
    cam.handheld(1.6)
    sfx(t0 + 0.1, "grunt", 0.6)


# ================================================================== THE BULLIES (30-42s)
def bully_line(t0, t1, n=3, expr="smug"):
    bs = []
    for i in range(1, n + 1):
        B = bully(i, t0, t1, expr)
        B.pose(t0, loc=(-3.4 + (i - 1) * 3.4, 12 + abs(i - 2) * 1.2, 0), rot=0)
        bs.append(B)
    return bs


@S(34, 113, 117, "Kids at school know: three bullies stride down the hall toward us")
def s34(t0, t1):
    hall()
    for i in range(1, 4):
        B = bully(i, t0, t1, "smug")
        x = -3.4 + (i - 1) * 3.4
        B.walk(t0, t1, (x, 22 + abs(i - 2) * 1.5, 0), (x, 15 + abs(i - 2) * 1.5, 0), rate=1.8, swing=26)
    cam = Cam()
    cam.key(t0, (0, 3, 1.8), (0, 18, 5.0), lens=22, focus=16.0, fstop=4)
    cam.key(t1, (0, 5, 2.0), (0, 18, 5.2), lens=22, focus=12.0, fstop=4)
    cam.handheld(1.0)
    sfx(t0, "stomp", 0.6)
    sfx(t0 + 0.4, "stomp", 0.5)


@S(35, 117, 121, "I'll never fight back: the narrator at his locker, shrinking as they loom")
def s35(t0, t1):
    hall()
    H = hero(t0, t1, "worried", glasses=False, L=False)
    p = (-2.6, 8, 0)
    H.pose(t0, loc=p, rot=-30)
    H.act(t0 + 0.1, "slump", 0.8, expr="lookdown")
    for i in range(1, 3):
        B = bully(i, t0, t1, "smug")
        B.pose(t0, loc=(0.6 + (i - 1) * 2.8, 10.5 + (i - 1), 0), rot=60)
        B.act(t0, "cross", 0.9)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.4), 7.5, 5.5, yaw=20, pitch=-4, lens=26, yaw1=28)
    cam.handheld(1.0)


def bully_shot(t0, t1, i, word, side=1):
    hall()
    B = bully(i, t0, t1, "shout")
    p = (0, 10, 0)
    B.pose(t0, loc=p, rot=0)
    B.act(t0, "point", 1.0, expr="shout")
    B.pose(t0, torso=(0, 12, 0))
    lips(B, t0, t1, "shout")
    shout("bub", word, (side * 0.3, 8.4, 6.9), t0 + 0.03, size=0.5, yaw=0, tilt=-6 * side)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.8), 8.0, 6.6, yaw=side * 14, pitch=6, lens=24, look=up(p, 5.4))
    cam.crash(t0 + 0.04, 20, 26, 0.1)
    cam.handheld(1.8)
    sfx(t0, "whoosh", 0.5)


def victim_poof(t0, t1, what, word=None):
    hall()
    p = (0, 9, 0)
    tp = t0 + 0.05
    H0 = hero(t0, t1, "shock", glasses=(what != "glasses"), L=(what == "none"), short=(what not in ("glasses", "short")),
              name="HeroA")
    H0.pose(t0, loc=p, rot=0)
    W2.vanish(H0, tp)
    H1 = hero(t0, t1, "shock", glasses=True, L=(what in ("L",)), short=(what in ("short", "L")), name="HeroB")
    H1.pose(t0, loc=p, rot=0)
    W2.appear(H1, tp, t0)
    W2.poof("pf", up(p, 4.4), tp, 0.8)
    flash(tp, 1.2, 0.2)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.4), 6.5, 5.5, yaw=-6, pitch=3, lens=26)
    cam.crash(tp, 26, 32, 0.08)
    cam.handheld(2.0)
    sfx(tp, "poof")


@S(36, 121, 122, "NERD!")
def s36(t0, t1):
    bully_shot(t0, t1, 1, "NERD!", 1)


@S(37, 122, 123, "Poof!: glasses appear")
def s37(t0, t1):
    victim_poof(t0, t1, "glasses")


@S(38, 123, 124, "Glasses.: extreme close, glasses glint, he blinks")
def s38(t0, t1):
    hall()
    H = hero(t0, t1, "bored", L=False)
    p = (0, 9, 0)
    H.pose(t0, loc=p, rot=0)
    H.face(t0 + 0.25, eyes="closed")
    H.face(t0 + 0.32, "bored")
    glint = sphere("glint_star", 0.12, (0.3, 8.3, 4.95), M("glint", "#ffffff", 0.2, emit=hexc("#ffffff"), estr=8), (3, 0.2, 0.4))
    pop_in(glint, t0 + 0.1, 1.0)
    shrink_out(glint, t0 + 0.4)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.7), 3.6, 3.0, yaw=0, pitch=0, lens=32)
    cam.handheld(0.6)
    sfx(t0 + 0.1, "sparkle", 0.7)


@S(39, 124, 125, "SHORTY!")
def s39(t0, t1):
    bully_shot(t0, t1, 2, "SHORTY!", -1)


@S(40, 125, 126, "Poof!: he shrinks")
def s40(t0, t1):
    victim_poof(t0, t1, "short")


@S(41, 126, 129, "Two inches gone: measuring marks on the locker, -2 IN")
def s41(t0, t1):
    hall()
    H = hero(t0, t1, "worried", L=False, short=True)
    p = (-4.0, 6.0, 0)
    H.pose(t0, loc=p, rot=90)
    H.pose(t0, head=(0, -10, 0))
    Mm = M("tape_black", "#151515", 0.4)
    for k in range(6):
        box(f"tick{k}", (0.12, 0.6, 0.06), (-4.65, 6.0 - 0.9, 5.2 + k * 0.25), Mm, 0)
    box("old_line", (0.1, 2.2, 0.1), (-4.65, 6.0, 6.5), M("x_red", "#e8322a", 0.4, emit=hexc("#e8322a"), estr=1.5), 0)
    box("new_line", (0.1, 2.2, 0.1), (-4.65, 6.0, 6.5 * 0.92), M("x_grn", "#2ac04a", 0.4, emit=hexc("#2ac04a"), estr=1.5), 0)
    tg = label("minus2", "-2 IN", (-4.6, 4.2, 6.3), 0.6, "#e8322a", rot=(90, 0, 90), extrude=0.04)
    pop_in(tg, w(127), 1.0)
    cam = Cam()
    cam.key(t0, (2.2, 2.6, 5.2), (-4.4, 5.4, 5.0), lens=24, focus=(-4.4, 5.6, 5.0), fstop=3.5)
    cam.key(t1, (1.6, 3.2, 5.6), (-4.4, 5.4, 5.4), lens=26, focus=(-4.4, 5.6, 5.4), fstop=3.5)
    cam.handheld(0.9)
    sfx(w(127), "pop", 0.5)
    sfx(t1 - 0.3, "aww", 0.35)


@S(42, 129, 130, "LOSER!: bully makes an L on his own forehead")
def s42(t0, t1):
    hall()
    B = bully(3, t0, t1, "shout")
    p = (0, 10, 0)
    B.pose(t0, loc=p, rot=0)
    B.act(t0, "facepalm", 0.7, expr="shout")
    lips(B, t0, t1, "shout")
    shout("bub", "LOSER!", (-0.3, 8.4, 6.9), t0 + 0.03, size=0.5, tilt=6)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.8), 8.0, 6.6, yaw=-12, pitch=6, lens=24, look=up(p, 5.4))
    cam.crash(t0 + 0.04, 20, 26, 0.1)
    cam.handheld(1.8)
    sfx(t0, "whoosh", 0.5)


@S(43, 130, 131, "Poof!: big L stamped")
def s43(t0, t1):
    victim_poof(t0, t1, "L")


@S(44, 131, 137, "A big L on my forehead: crash in on the red L, red pulse")
def s44(t0, t1):
    hall()
    H = hero(t0, t1, "bored", short=True)
    p = (0, 9, 0)
    H.pose(t0, loc=p, rot=0)
    H.face(w(133), eyes="up", mouth="flat")
    H.pose(w(133), head=(0, -8, 0))
    tg = up(p, 4.62 * 0.92 + 0.35)
    cam = Cam()
    cam.key(t0, orbit_pos(tg, 6.0, -10, 3), tg, lens=26, focus=tg, fstop=3)
    cam.key(w(133), orbit_pos(tg, 5.0, -4, 2), tg, lens=28, focus=tg, fstop=3)
    cam.crash(w(133), 28, 46, 0.1)
    cam.key(t1, orbit_pos(tg, 4.6, 4, 2), tg, lens=46, focus=tg, fstop=3)
    cam.handheld(0.9)
    sfx(w(133), "boom", 0.4)


@S(45, 137, 140, "I said nothing: he stares ahead, the bullies laugh behind him")
def s45(t0, t1):
    hall()
    H = hero(t0, t1, "neutral", short=True)
    p = (0, 6, 0)
    H.pose(t0, loc=p, rot=0)
    for i in range(1, 4):
        B = bully(i, t0, t1, "joy")
        B.pose(t0, loc=(-3.8 + (i - 1) * 3.8, 13 + abs(i - 2), 0), rot=0)
        laugh(B, t0, t1, rate=5, flail=False)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.3), 7.0, 5.0, yaw=0, pitch=2, lens=26)
    cam.handheld(0.6)
    sfx(t0, "kids_laugh", 0.5)


@S(46, 140, 142, "Every day.: a calendar flips MON TUE WED THU")
def s46(t0, t1):
    hall()
    H = hero(t0, t1, "lookdown", short=True)
    p = (2.0, 8, 0)
    H.walk(t0, t1, (0.5, 15, 0), (0.3, 11, 0), rate=1.4, swing=18)
    H.act(t0, "slump", 0.6)
    n = 4
    labs = [(t0 + k * (t1 - t0) / n, d) for k, d in enumerate(("MON", "TUE", "WED", "THU"))]
    calendar("cal", (-4.62, 7.0, 7.0), t0, labs, rot=90)
    cam = Cam()
    cam.key(t0, (3.0, 5.0, 6.2), (-4.6, 7.4, 6.4), lens=24, focus=7.6, fstop=4)
    cam.key(t1, (2.2, 5.8, 6.6), (-4.6, 7.2, 6.8), lens=26, focus=6.8, fstop=4)
    cam.handheld(0.8)


# ================================================================== THE FIRE (42-50s)
@S(47, 142, 145, "But one night: the quiet house at night, moon, slow push")
def s47(t0, t1):
    fire_house(t0, t1, fire=0.0, smoke=False, truck=False)
    for i, (x, z) in enumerate(((-5.5, 3.4), (5.5, 9.6))):
        card(f"warm{i}", 3.3, 2.9, (x, HOUSE_FRONT - 0.06, z), mat("warmwin", hexc("#ffd890"), 0.4, emit=hexc("#ffc060"),
                                                                      estr=4), "-Y")
    light("porch", "POINT", (0, HOUSE_FRONT - 1.5, 5.2), 600, (1.0, 0.8, 0.5), 0.5)
    cam = Cam()
    cam.key(t0, (-4, -24, 4), (0, 8, 7), lens=24, focus=32.0, fstop=8)
    cam.key(t1, (-3, -21, 4.5), (0, 8, 7.2), lens=24, focus=29.0, fstop=8)
    cam.handheld(0.5)
    sfx(t0, "crickets", 0.6, dur=t1 - t0 + 0.4)


@S(48, 145, 149, "our house caught fire: the windows blow out in flames, WHOOSH")
def s48(t0, t1):
    tf = w(147)
    fire_house(t0, t1, fire=1.0, smoke=True, truck=False)
    ex = []
    for ob in bpy.data.objects:
        if ob.name.startswith(("fh_fw", "fh_froof", "fh_fside", "fh_fl", "fh_glow", "fh_emb", "fh_smoke")):
            ex.append(ob)
    for ob in ex:
        sets.set_obj_visible(ob, tf - FR, False)
        sets.set_obj_visible(ob, tf, True)
    cam = Cam()
    cam.key(t0, (-3, -21, 4.5), (0, 8, 7.2), lens=24, focus=29.0, fstop=8)
    cam.key(tf, (-2.6, -20, 4.6), (0, 8, 7.4), lens=24, focus=28.0, fstop=8)
    cam.key(t1, (-1.5, -17, 5.5), (0, 8, 8), lens=22, focus=25.0, fstop=8)
    cam.crash(tf, 26, 32, 0.12)
    cam.handheld(1.0)
    cam.shake(0.02, 3)
    flash(tf, 1.0, 0.25)
    sfx(tf, "boom", 0.8)
    sfx(tf, "fire", 0.9, dur=V.w(171) - tf)
    sfx(tf + 0.2, "alarm", 0.35, dur=2.5)


@S(49, 149, 152, "My big sister: on the roof edge, terrified, firelit")
def s49(t0, t1):
    fire_house(t0, t1)
    Sx = sis(t0, t1, "terror")
    Sx.pose(t0, loc=ROOF_P, rot=0)
    Sx.act(t0, "hands_head", 0.9)
    tg = up(ROOF_P, 4.8)
    cam = Cam()
    cam.push(t0, t1, tg, 7.0, 5.0, yaw=15, pitch=-4, lens=28, look=up(ROOF_P, 4.4))
    cam.handheld(1.2)
    sfx(t0, "gasp", 0.7)


@S(50, 152, 157, "was trapped on the roof: wide, crane up, flames everywhere")
def s50(t0, t1):
    fire_house(t0, t1)
    Sx = sis(t0, t1, "scream")
    Sx.pose(t0, loc=ROOF_P, rot=0)
    Sx.panic(t0, t1)
    cam = Cam()
    cam.key(t0, (10, -22, 4), (0, 8, 10), lens=22, focus=30.0, fstop=8)
    cam.key(t1, (6, -24, 12), (0, 7, 12), lens=22, focus=31.0, fstop=8)
    cam.handheld(1.0)


@S(51, 157, 160, "The firefighters' ladder: ladder extends from the fire truck")
def s51(t0, t1):
    fire_house(t0, t1, ladder=1.0)
    lad = ladder_obj()
    keyscale(lad, t0, (1, 1, 0.25))
    keyscale(lad, t1, (1, 1, 1.0))
    for i, x in enumerate((-10, -6)):
        Fi = ff(i, t0, t1, "determined")
        Fi.pose(t0, loc=(x, -3, 0), rot=150)
        Fi.act(t0, "point", 0.7)
    cam = Cam()
    cam.key(t0, (-2, -24, 3), (-12, 0, 8), lens=22, focus=25.0, fstop=8)
    cam.key(t1, (-1, -22, 4), (-9, 1, 9.5), lens=22, focus=24.0, fstop=8)
    cam.handheld(1.0)
    sfx(t0, "hydraulic", 0.7)
    sfx(t0 + 0.1, "siren", 0.45, dur=t1 - t0)


@S(52, 160, 163, "was too short: ladder tip stops metres below her, a sad shrug")
def s52(t0, t1):
    fire_house(t0, t1)
    Sx = sis(t0, t1, "cry")
    Sx.pose(t0, loc=ROOF_P, rot=0)
    Sx.act(t0, "reach", 0.6)
    Sx.pose(t0, head=(0, 25, 0))
    Fi = ff(0, t0, t1, "worried")
    Fi.pose(t0, loc=(-5.0, 3.0, 0), rot=170)
    Fi.act(t0 + 0.2, "shrug", 1.0)
    cam = Cam()
    cam.key(t0, (-4, -12, 5), (-4, 5, 10.5), lens=20, focus=17.0, fstop=6)
    cam.key(t1, (-3, -11, 4), (-3, 5, 11.5), lens=20, focus=17.0, fstop=6)
    cam.handheld(1.0)
    sfx(t0 + 0.2, "sad_trombone", 0.6)


@S(53, 163, 167, "The flames were climbing: flames crawl up the wall toward her feet")
def s53(t0, t1):
    fire_house(t0, t1, climb=(t0, t1))
    Sx = sis(t0, t1, "terror")
    Sx.pose(t0, loc=ROOF_P, rot=0)
    Sx.pose(t0, loc=(0, ROOF_P[1] + 0.2, ROOF_Z), torso=(0, -8, 0))
    Sx.pose(t1, loc=(0, ROOF_P[1] + 1.5, ROOF_Z), torso=(0, -14, 0))
    Sx.act(t0 + 0.3, "recoil", 0.9)
    cam = Cam()
    cam.key(t0, (2, -4, 2.0), (0, HOUSE_FRONT, 6), lens=22, focus=10.0, fstop=4)
    cam.key(t1, (1.5, -5, 7), (0, HOUSE_FRONT, 13), lens=22, focus=12.0, fstop=4)
    cam.handheld(1.3)
    sfx(t0, "whoosh", 0.6)


@S(54, 167, 169, "She screamed: extreme close, scream, shake")
def s54(t0, t1):
    fire_house(t0, t1)
    Sx = sis(t0, t1, "scream", sooty=True)
    Sx.pose(t0, loc=ROOF_P, rot=0)
    Sx.act(t0, "hands_head", 1.0)
    tg = up(ROOF_P, 4.85)
    cam = Cam()
    cam.push(t0, t1, tg, 4.6, 3.4, yaw=-6, pitch=0, lens=30)
    cam.crash(t0 + 0.1, 30, 38, 0.08)
    cam.handheld(2.0)
    cam.shake(0.03, 2)


@S(55, 169, 171, "Do something!: she points down at the narrator, bubble")
def s55(t0, t1):
    fire_house(t0, t1)
    Sx = sis(t0, t1, "shout", sooty=True)
    Sx.pose(t0, loc=ROOF_P, rot=10)
    Sx.act(t0, "point", 1.0)
    Sx.pose(t0, head=(0, 30, 0), torso=(0, 15, 0))
    lips(Sx, t0, t1, "shout")
    shout("bub", "DO\nSOMETHING!", (-3.0, ROOF_P[1] - 1.0, ROOF_Z + 7.6), t0 + 0.03, size=0.5, yaw=-8)
    cam = Cam()
    cam.key(t0, (6, -6, 9), up(ROOF_P, 5.2), lens=24, focus=up(ROOF_P, 5), fstop=4)
    cam.key(t1, (4.5, -5, 10), up(ROOF_P, 5.4), lens=26, focus=up(ROOF_P, 5), fstop=4)
    cam.handheld(1.5)


# ================================================================== THE IDEA (50-59s)
@S(56, 171, 175, "Then I noticed something: close push on the narrator, eyes narrow, DING")
def s56(t0, t1):
    fire_house(t0, t1, smoke=False)
    H = hero(t0, t1, "worried", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    td = w(173)
    H.face(td, "sus")
    H.act(td, "think", 0.8)
    tg = up(HERO_P, 4.62 * 0.92)
    cam = Cam()
    cam.push(t0, t1, tg, 6.0, 3.8, yaw=180, pitch=0, lens=28, yaw1=176)
    cam.handheld(0.6)
    sfx(td, "ding", 0.8)


@S(57, 175, 180, "Insults don't just hurt you: he touches his glasses, the L glows")
def s57(t0, t1):
    fire_house(t0, t1, smoke=False)
    H = hero(t0, t1, "sus", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0 + 0.1, "facepalm", 0.45)
    H.pose(t0 + 0.1, armR=(150, -15), head=(0, -5, 0))
    tg = up(HERO_P, 4.62 * 0.92 + 0.2)
    gl = sphere("Lglow", 0.5, (HERO_P[0], HERO_P[1] + 0.7, tg[2] + 0.25), mat("Lglow", hexc("#ff4040"), 0.3,
                emit=hexc("#ff3030"), estr=3.0, alpha=0.35), (1, 0.2, 0.7))
    pop_in(gl, w(178), 1.0)
    cam = Cam()
    cam.orbit(t0, t1, tg, 4.2, 200, 165, pitch=4, lens=30, steps=3, fstop=2.8)
    cam.handheld(0.6)


@S(58, 180, 183, "They change you: thought bubble, banana head -> turtle -> pig")
def s58(t0, t1):
    fire_house(t0, t1, smoke=False)
    H = hero(t0, t1, "sus", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0, "think", 0.8)
    th = thought("th", (HERO_P[0] - 2.6, HERO_P[1] + 1.0, 8.6), t0 + 0.02, 0.85, yaw=180)
    tu = turtle("tt", (0, 0, -0.6), 0.55, rot=0)
    tu.parent = th
    tu.location = (-0.9, -0.2, -0.7)
    cc = chicken("tch", (1.0, -0.2, -1.1), 0.38)
    cc["root"].parent = th
    cc["root"].location = (1.0, -0.2, -1.1)
    tg = up(HERO_P, 5.4)
    cam = Cam()
    cam.push(t0, t1, (HERO_P[0] - 1.2, HERO_P[1], 6.5), 9.0, 7.5, yaw=172, pitch=4, lens=26)
    cam.handheld(0.7)


@S(59, 183, 189, "And maybe, they could save her: he looks up at her, determined")
def s59(t0, t1):
    fire_house(t0, t1)
    H = hero(t0, t1, "determined", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    look_at(H, t0 + 0.1, (0, 6, 16))
    H.act(w(187), "fists", 0.9, expr="determined")
    tg = up(HERO_P, 4.4)
    cam = Cam()
    cam.key(t0, (HERO_P[0] + 1.4, HERO_P[1] - 2.8, 5.4), (0.5, 6, 8.5), lens=22, focus=up(HERO_P, 4), fstop=4)
    cam.key(t1, (HERO_P[0] + 1.0, HERO_P[1] - 2.3, 5.2), (0.5, 6, 9.5), lens=22, focus=up(HERO_P, 4), fstop=4)
    cam.handheld(0.8)
    sfx(w(187), "rise", 0.6)


@S(60, 189, 194, "I took a deep breath: chest puffs, camera pushes in")
def s60(t0, t1):
    fire_house(t0, t1)
    H = hero(t0, t1, "determined", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    tb = w(192)
    H.pose(tb, torso=(0, -14, 0), head=(0, -12, 0), armL=(25, 35), armR=(25, 35))
    H.face(tb, eyes="closed", mouth="o")
    keyscale(H.torso, tb, 1.0)
    keyscale(H.torso, t1, (1.12, 1.15, 1.06))
    tg = up(HERO_P, 4.4)
    cam = Cam()
    cam.push(t0, t1, tg, 7.5, 5.0, yaw=165, pitch=2, lens=26)
    cam.handheld(0.8)
    sfx(tb, "inhale", 0.8)


@S(61, 194, 197, "and yelled the: low angle, mouth opening wide, wind")
def s61(t0, t1):
    fire_house(t0, t1)
    H = hero(t0, t1, "shout", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0, "fists", 0.9)
    H.pose(t0, head=(0, -20, 0))
    lips(H, t0, t1, "shout")
    tg = up(HERO_P, 4.4)
    cam = Cam()
    cam.key(t0, (HERO_P[0] + 2.8, HERO_P[1] + 4.6, 1.4), tg, lens=22, roll=8, focus=tg, fstop=3)
    cam.key(t1, (HERO_P[0] + 2.0, HERO_P[1] + 3.8, 1.2), tg, lens=24, roll=2, focus=tg, fstop=3)
    cam.handheld(1.2)


@S(62, 197, 202, "meanest thing I'd ever said: riser, ultra push into his face")
def s62(t0, t1):
    fire_house(t0, t1)
    H = hero(t0, t1, "furious", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0, "fists", 1.0, expr="furious")
    lips(H, t0, t1, "shout")
    tg = up(HERO_P, 4.62 * 0.92)
    cam = Cam()
    cam.push(t0, t1, tg, 7.0, 2.9, yaw=180, pitch=0, lens=28, ease="EASE_IN")
    cam.handheld(1.0)
    cam.shake(0.012, 3)
    sfx(t0, "rise", 0.9)


@S(63, 202, 206, "You're such a chicken!: full-force shout, speed lines, bubble")
def s63(t0, t1):
    fire_house(t0, t1)
    H = hero(t0, t1, "furious", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0, "point", 1.0)
    H.pose(t0, head=(0, -15, 0), torso=(0, -10, 0))
    lips(H, t0, t1, "shout")
    shout("bub", "YOU'RE SUCH\nA CHICKEN!", (HERO_P[0] - 0.8, HERO_P[1] - 0.5, 8.0), t0 + 0.04, size=0.42, yaw=180, tilt=5)
    tg = up(HERO_P, 4.4)
    cam = Cam()
    cam.push(t0, t1, tg, 5.0, 6.8, yaw=190, pitch=-6, lens=22, look=up(HERO_P, 5.4))
    cam.crash(t0 + 0.05, 30, 22, 0.1)
    cam.handheld(2.0)
    cam.shake(0.03, 2)
    sfx(t0, "whoosh", 0.7)


@S(64, 206, 207, "Poof!: big poof on the roof")
def s64(t0, t1):
    fire_house(t0, t1)
    Sx = sis(t0, t1, "scream", sooty=True)
    Sx.pose(t0, loc=ROOF_P, rot=0)
    tp = t0 + 0.05
    W2.vanish(Sx, tp)
    C = chicken("ch", ROOF_P, 1.25)
    vis(C["root"], [(tp, True)])
    W2.poof("pf", up(ROOF_P, 3.6), tp, 1.2)
    flash(tp, 1.6, 0.25)
    cam = Cam()
    cam.push(t0, t1, up(ROOF_P, 3.5), 10, 8.5, yaw=-10, pitch=2, lens=24)
    cam.handheld(2.0)
    sfx(tp, "poof")
    sfx(tp, "boom", 0.4)


@S(65, 207, 212, "She turned into a chicken: reveal, the chicken blinks, BAWK")
def s65(t0, t1):
    fire_house(t0, t1)
    C = chicken("ch", ROOF_P, 1.25)
    look = C["head"]
    keyrot(look, t0, (0, 0, -20))
    keyrot(look, t0 + 0.4, (0, 0, 25))
    keyrot(look, t1, (10, 0, 0))
    tg = up(ROOF_P, 4.0)
    cam = Cam()
    cam.orbit(t0, t1, tg, 7.0, -25, 15, pitch=6, lens=28, steps=3, fstop=3)
    cam.handheld(0.9)
    sfx(w(211), "cluck", 0.9)


@S(66, 212, 214, "She flapped.: wings flap, feathers fly")
def s66(t0, t1):
    fire_house(t0, t1)
    C = chicken("ch", ROOF_P, 1.25)
    flap(C, t0, t1, 7, 70)
    rnd = random.Random(1)
    for i in range(10):
        f = sphere(f"feather{i}", 0.12, up(ROOF_P, 3), M("chk_white", "#fbf8f2", 0.7), (1.8, 0.4, 0.6), seg=8)
        keyloc(f, t0 + 0.05 * i, up(ROOF_P, 3))
        keyloc(f, t1 + 0.4, (rnd.uniform(-4, 4), ROOF_P[1] - rnd.uniform(0, 3), ROOF_Z + rnd.uniform(0, 5)))
        noise(f, "rotation_euler", 0, 3, 5)
    cam = Cam()
    cam.push(t0, t1, up(ROOF_P, 3.5), 7.5, 6.0, yaw=8, pitch=2, lens=26)
    cam.handheld(1.4)
    sfx(t0, "flap", 0.8, dur=t1 - t0)


@S(67, 214, 217, "Flap, flap, flap!: she jumps off the roof, flapping like crazy")
def s67(t0, t1):
    fire_house(t0, t1)
    C = chicken("ch", ROOF_P, 1.25)
    r = C["root"]
    keyloc(r, t0, ROOF_P)
    keyloc(r, t0 + 0.2, (0, ROOF_P[1] - 1.5, ROOF_Z + 1.5))
    keyloc(r, t1, (0, ROOF_P[1] - 4.0, ROOF_Z + 2.4))
    flap(C, t0, t1, 12, 85)
    for k, tt in enumerate((w(214), w(215), w(216))):
        mk = mark(f"flap{k}", "FLAP!", (-4 + k * 3.6, ROOF_P[1] - 6, ROOF_Z + 7 - k * 1.2), tt, 0.9, "#ffe23a")
        sfx(tt, "flap", 0.7)
    cam = Cam()
    cam.key(t0, (2, -10, 13), up(ROOF_P, 3), lens=22, focus=14.0, fstop=6)
    cam.key(t1, (1, -11, 16), (0, ROOF_P[1] - 3, ROOF_Z + 5), lens=22, focus=13.0, fstop=6)
    cam.handheld(1.6)


@S(68, 217, 222, "But chickens can't really fly: mid-air, wings stall, a cricket chirps")
def s68(t0, t1):
    fire_house(t0, t1)
    p = (0, 2.0, 15.5)
    C = chicken("ch", p, 1.25)
    r = C["root"]
    keyloc(r, t0, p)
    keyloc(r, t1, (0, 1.5, 14.6))
    flap(C, t0, w(220), 10, 75)
    keyrot(C["wL"], t1, (0, -5, 0))
    keyrot(C["wR"], t1, (0, 5, 0))
    keyrot(C["head"], w(220), (0, 0, 0))
    keyrot(C["head"], w(221), (20, 0, 0))
    cam = Cam()
    cam.orbit(t0, t1, up(p, 3.6), 9.0, 20, -10, pitch=4, lens=26, steps=3, fstop=4)
    cam.handheld(1.0)
    sfx(w(221), "crickets", 0.6, dur=0.8)


@S(69, 222, 225, "She was falling: camera whips down with her, wind")
def s69(t0, t1):
    fire_house(t0, t1)
    p0, p1 = (0, 1.5, 15.0), (0, 1.0, 8.5)
    C = chicken("ch", p0, 1.25)
    r = C["root"]
    keyloc(r, t0, p0)
    keyloc(r, t1, p1, "LINEAR")
    keyrot(r, t0, (0, 0, 0))
    keyrot(r, t1, (25, 0, 30))
    flap(C, t0, t1, 14, 85)
    cam = Cam()
    cam.key(t0, (5, -8, 18), up(p0, 3), lens=24, focus=10.0, fstop=4)
    cam.key(t1, (5, -9, 11), up(p1, 2), lens=24, focus=10.0, fstop=4, ease="EASE_IN")
    cam.handheld(1.8)
    sfx(t0, "fall_whistle", 0.7)


@S(70, 225, 228, "You're an airhead!: narrator shouts, bubble")
def s70(t0, t1):
    fire_house(t0, t1)
    H = hero(t0, t1, "furious", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0, "point", 1.0)
    H.pose(t0, head=(0, -18, 0))
    lips(H, t0, t1, "shout")
    shout("bub", "YOU'RE AN\nAIRHEAD!", (HERO_P[0] - 0.8, HERO_P[1] - 0.5, 8.0), t0 + 0.04, size=0.42, yaw=180, tilt=-5)
    tg = up(HERO_P, 4.4)
    cam = Cam()
    cam.push(t0, t1, tg, 5.5, 7.0, yaw=165, pitch=-4, lens=22, look=up(HERO_P, 5.4))
    cam.crash(t0 + 0.05, 30, 22, 0.1)
    cam.handheld(1.8)
    sfx(t0, "whoosh", 0.6)


@S(71, 228, 229, "Poomp!: head inflates mid-fall")
def s71(t0, t1):
    fire_house(t0, t1)
    p = (0, 1.0, 9.0)
    C = chicken("ch", p, 1.25)
    r = C["root"]
    keyloc(r, t0, p)
    ti = t0 + 0.05
    keyloc(r, t1, up(p, 0.6))
    flap(C, t0, t1, 10, 70)
    inflate(C, ti)
    flash(ti, 1.0, 0.2)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.6), 11.0, 9.0, yaw=-8, pitch=6, lens=24)
    cam.crash(ti, 24, 20, 0.1)
    cam.handheld(2.0)
    sfx(ti, "inflate")
    sfx(ti + 0.08, "pop", 0.6)


@S(72, 229, 237, "Her head blew up like a giant balloon: close orbit, bobbing, squeaky rubber")
def s72(t0, t1):
    fire_house(t0, t1)
    p = (0, 1.0, 9.6)
    C = chicken("ch", p, 1.25, balloon=True)
    r = C["root"]
    keyloc(r, t0, p)
    keyloc(r, t1, up(p, 1.6))
    flap(C, t0, t1, 3, 25)
    b = C["ball"]
    for k in range(6):
        tt = t0 + k * (t1 - t0) / 6
        keyscale(b, tt, (1.0 + 0.05 * (k % 2), 1.0 + 0.05 * (k % 2), 1.0 - 0.04 * (k % 2)))
    tg = up(p, 6.4)
    cam = Cam()
    cam.orbit(t0, t1, tg, 9.0, 20, -25, pitch=0, lens=28, steps=4, fstop=4)
    cam.handheld(0.8)
    sfx(t0 + 0.2, "squeak", 0.6)


@S(73, 237, 246, "She floated like a parade float: wide, firefighters look up amazed")
def s73(t0, t1):
    fire_house(t0, t1, tramp=False)
    p0 = (0, 0.0, 11.5)
    C = chicken("ch", p0, 1.25, balloon=True)
    keyloc(C["root"], t0, p0)
    keyloc(C["root"], t1, (0.5, 0.5, 13.5))
    flap(C, t0, t1, 3, 25)
    for i, x in enumerate((-7, 6)):
        Fi = ff(i, t0, t1, "gasp")
        Fi.pose(t0, loc=(x, -4, 0), rot=180 + (20 if x < 0 else -20))
        look_at(Fi, t0 + 0.1, (0, 0, 15))
        Fi.act(t0 + 0.2, "shock", 0.8)
    H = hero(t0, t1, "gasp", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    look_at(H, t0 + 0.1, (0, 0, 15))
    confetti("conf", (0, -2, 10), (6, 3, 4), w(244), 1.2, n=40, fall=8)
    cam = Cam()
    cam.key(t0, (-4, -26, 3), (0, 0, 10), lens=22, focus=26.0, fstop=8)
    cam.key(t1, (4, -24, 2.5), (0, 0, 11), lens=22, focus=25.0, fstop=8)
    cam.handheld(0.8)
    sfx(w(244), "confetti", 0.6)
    sfx(w(244), "cheer", 0.35)


@S(74, 246, 250, "But the wind started: a gust, wind lines, she spins toward the smoke")
def s74(t0, t1):
    fire_house(t0, t1)
    p0 = (0.5, 0.5, 13.5)
    C = chicken("ch", p0, 1.25, balloon=True)
    keyloc(C["root"], t0, p0)
    keyloc(C["root"], t1, (1.5, 3.0, 15.0))
    keyrot(C["root"], t0, (0, 0, 0))
    keyrot(C["root"], t1, (0, -20, 40))
    flap(C, t0, t1, 8, 70)
    Ml = mat("windline", (1, 1, 1), 0.5, emit=(1, 1, 1), estr=2.5, alpha=0.6)
    rnd = random.Random(3)
    for i in range(10):
        z = 12 + rnd.uniform(0, 8)
        ln = box(f"wind{i}", (5.0, 0.06, 0.06), (-14, -2 + rnd.uniform(0, 5), z), Ml, 0)
        st = t0 + rnd.uniform(0, 0.5)
        keyloc(ln, st, (-16, ln.location[1], z), "LINEAR")
        keyloc(ln, st + 0.5, (14, ln.location[1] + 3, z + 1), "LINEAR")
    cam = Cam()
    cam.push(t0, t1, up(p0, 4.8), 13.0, 11.0, yaw=-30, pitch=2, lens=24, yaw1=-15)
    cam.handheld(1.4)
    sfx(t0, "wind", 0.9, dur=t1 - t0 + 1.5)


@S(75, 250, 257, "pulling her right back into the smoke: she drifts into the black smoke, he panics")
def s75(t0, t1):
    fire_house(t0, t1)
    p0 = (1.5, 3.0, 15.0)
    C = chicken("ch", p0, 1.25, balloon=True)
    keyloc(C["root"], t0, p0)
    keyloc(C["root"], t1, (2.5, 9.0, 19.0))
    flap(C, t0, t1, 10, 80)
    H = hero(t0, t1, "panic", short=True)
    hp = (HERO_P[0] - 1, HERO_P[1] + 4, 0)
    H.pose(t0, loc=hp, rot=180)
    H.panic(t0, t1)
    look_at(H, t0, (2, 6, 17))
    cam = Cam()
    cam.key(t0, (hp[0] + 2.5, hp[1] - 7, 4.0), (2, 5, 10), lens=22, focus=up(hp, 4), fstop=5)
    cam.key(t1, (hp[0] + 2.0, hp[1] - 8, 3.5), (2.5, 8, 12), lens=22, focus=up(hp, 4), fstop=5)
    cam.handheld(1.4)
    sfx(t0 + 0.3, "gasp", 0.6)


@S(76, 257, 263, "You're as dumb as a rock!: final shout, speed lines")
def s76(t0, t1):
    fire_house(t0, t1)
    H = hero(t0, t1, "furious", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0, "fists", 1.0)
    H.pose(t0, head=(0, -12, 0), torso=(0, 10, 0))
    lips(H, t0, t1, "shout")
    shout("bub", "DUMB AS\nA ROCK!", (HERO_P[0] + 0.2, HERO_P[1] + 0.3, 6.5), w(259), size=0.4, yaw=180, tilt=4)
    tg = up(HERO_P, 4.6)
    cam = Cam()
    cam.push(t0, t1, tg, 7.0, 4.2, yaw=185, pitch=-3, lens=26, look=up(HERO_P, 5.0))
    cam.crash(w(259), 26, 32, 0.08)
    cam.handheld(1.8)
    cam.shake(0.02, 2)
    sfx(t0, "rise", 0.6)


@S(77, 263, 264, "Bonk!: she turns to stone in the smoke, BONK")
def s77(t0, t1):
    fire_house(t0, t1)
    p = (2.5, 9.0, 19.0)
    C = chicken("ch", p, 1.25, balloon=True)
    Cs = chicken("chs", p, 1.25, balloon=True, stone=True)
    tb = t0 + 0.04
    vis(C["root"], [(tb, False)])
    vis(Cs["root"], [(tb, True)])
    W2.poof("pf", up(p, 5.0), tb, 1.3)
    mark("bonk", "BONK!", (p[0] - 3, p[1] - 4, p[2] + 7.5), tb, 1.4, "#ffe23a")
    cam = Cam()
    cam.push(t0, t1, up(p, 5.0), 13.0, 11.0, yaw=0, pitch=4, lens=24)
    cam.crash(tb, 24, 30, 0.08)
    cam.handheld(2.2)
    cam.shake(0.04, 2)
    sfx(tb, "bonk")
    sfx(tb + 0.05, "stone", 0.7)


@S(78, 264, 268, "She turned to stone: the stone chicken hangs a beat, then drops")
def s78(t0, t1):
    fire_house(t0, t1)
    p = (2.5, 9.0, 19.0)
    Cs = chicken("chs", p, 1.25, balloon=True, stone=True)
    r = Cs["root"]
    keyloc(r, t0, p)
    keyloc(r, t1 - 0.25, up(p, 0.3))
    keyloc(r, t1, up(p, -1.2))
    tg = up(p, 4.5)
    cam = Cam()
    cam.orbit(t0, t1, tg, 10.0, -15, 15, pitch=2, lens=26, steps=3, fstop=4)
    cam.handheld(1.0)
    sfx(t1 - 0.25, "fall_whistle", 0.7)


@S(79, 268, 272, "and dropped straight down: fast fall, camera dives after it")
def s79(t0, t1):
    fire_house(t0, t1, tramp=True)
    p0, p1 = (2.0, 7.0, 18.0), (0.4, 0.0, 6.0)
    Cs = chicken("chs", p0, 1.25, balloon=True, stone=True)
    keyloc(Cs["root"], t0, p0)
    keyloc(Cs["root"], t1, p1, "LINEAR")
    for i, x in enumerate((-3.6, 3.6)):
        Fi = ff(i, t0, t1, "terror")
        Fi.pose(t0, loc=(x, TRAMP[1], 0), rot=90 if x < 0 else -90)
        Fi.act(t0, "hold", 0.9)
    cam = Cam()
    cam.key(t0, (8, -6, 22), up(p0, 3), lens=22, focus=14.0, fstop=6)
    cam.key(t1, (8, -10, 9), up(p1, 2), lens=22, focus=13.0, fstop=6, ease="EASE_IN")
    cam.handheld(1.6)
    sfx(t0, "whoosh", 0.8)


@S(80, 272, 276, "onto the firefighters' trampoline: they sprint underneath, trampoline ready")
def s80(t0, t1):
    fire_house(t0, t1, tramp=True)
    tp = bpy.data.objects["tramp"]
    keyloc(tp, t0, (-8, TRAMP[1] - 2, 0))
    keyloc(tp, t1 - 0.3, TRAMP)
    for i, x in enumerate((-3.6, 3.6)):
        Fi = ff(i, t0, t1, "determined")
        Fi.run(t0, t1 - 0.3, (x - 8, TRAMP[1] - 2, 0), (x, TRAMP[1], 0))
        Fi.pose(t1 - 0.3, rot=90 if x < 0 else -90)
        Fi.act(t1 - 0.3, "hold", 0.9)
    Cs = chicken("chs", (0.3, 0.0, 12), 1.25, balloon=True, stone=True)
    keyloc(Cs["root"], t0, (0.3, -0.5, 14))
    keyloc(Cs["root"], t1, (0.1, -1.4, 3.4), "LINEAR")
    cam = Cam()
    cam.key(t0, (-6, -20, 3), (-4, -2, 4), lens=22, focus=18.0, fstop=6)
    cam.key(t1, (2, -18, 4), (0, -1, 5), lens=22, focus=16.0, fstop=6)
    cam.handheld(1.4)
    sfx(t0, "footsteps", 0.7, dur=t1 - t0)


@S(81, 276, 277, "Boing!: stone chicken hits the trampoline, it stretches, BOING")
def s81(t0, t1):
    fire_house(t0, t1, tramp=True)
    for i, x in enumerate((-3.6, 3.6)):
        Fi = ff(i, t0, t1, "terror")
        Fi.pose(t0, loc=(x, TRAMP[1], 0), rot=90 if x < 0 else -90)
        Fi.act(t0, "brace", 1.0)
    tb = t0 + 0.04
    Cs = chicken("chs", (0, TRAMP[1], 2.4), 1.25, balloon=True, stone=True)
    keyloc(Cs["root"], t0, (0, TRAMP[1], 6.0))
    keyloc(Cs["root"], tb, (0, TRAMP[1], 2.0), "LINEAR")
    keyloc(Cs["root"], tb + 0.12, (0, TRAMP[1], 1.0))
    keyloc(Cs["root"], t1, (0, TRAMP[1], 4.8))
    mt = bpy.data.objects["tramp_mat"]
    keyscale(mt, tb, (1, 1, 1))
    keyscale(mt, tb + 0.12, (1.05, 1.05, 12))
    keyloc(mt, tb + 0.12, (0, 0, 1.6))
    keyloc(mt, tb, (0, 0, 2.3))
    keyscale(mt, t1, (1, 1, 1))
    keyloc(mt, t1, (0, 0, 2.3))
    mark("boing", "BOING!", (0, TRAMP[1] - 3, 9.5), tb, 1.4, "#7ad8ff")
    cam = Cam()
    cam.push(t0, t1, (0, TRAMP[1], 3.0), 13, 11, yaw=-8, pitch=6, lens=22)
    cam.crash(tb, 22, 28, 0.08)
    cam.handheld(2.0)
    cam.shake(0.03, 2)
    sfx(tb, "boing")
    sfx(tb, "thud", 0.6)


@S(82, 277, 280, "She was safe.: stone chicken on the lawn, firefighters cheer")
def s82(t0, t1):
    fire_house(t0, t1, tramp=True)
    Cs = chicken("chs", (0, TRAMP[1], 2.4), 1.25, balloon=True, stone=True)
    keyloc(Cs["root"], t0, (0, TRAMP[1], 4.8))
    keyloc(Cs["root"], t0 + 0.35, (0, TRAMP[1], 2.4))
    for i, x in enumerate((-3.6, 3.6)):
        Fi = ff(i, t0, t1, "joy")
        Fi.pose(t0, loc=(x, TRAMP[1], 0), rot=90 if x < 0 else -90)
        Fi.act(t0 + 0.4, "cheer", 1.0)
    cam = Cam()
    cam.push(t0, t1, (0, TRAMP[1], 5.0), 15, 12.5, yaw=10, pitch=8, lens=24)
    cam.handheld(0.8)
    sfx(t0 + 0.4, "cheer", 0.6)


@S(83, 280, 287, "A rock, a chicken, and a balloon: orbit, a crash zoom on each word")
def s83(t0, t1):
    fire_house(t0, t1, tramp=True)
    Cs = chicken("chs", (0, TRAMP[1], 2.4), 1.25, balloon=True, stone=True)
    tg = (0, TRAMP[1], 6.5)
    cam = Cam()
    cam.orbit(t0, t1, tg, 11.0, -35, 35, pitch=4, lens=24, steps=4, fstop=4)
    for k, i in enumerate((281, 283, 286)):
        cam.crash(w(i), 24 + k * 4, 28 + k * 4, 0.08)
        sfx(w(i), "click", 0.5)
    cam.handheld(0.8)
    for k, (i, txt) in enumerate(((281, "ROCK"), (283, "CHICKEN"), (286, "BALLOON"))):
        mk = mark(f"lbl{k}", txt, (-4 + k * 4.0, TRAMP[1] - 4, 13.5 - k * 1.3), w(i), 0.9,
                  ["#b8bcc4", "#ffe23a", "#ff8fc0"][k])


@S(84, 287, 289, "But safe.: narrator exhales, relieved thumbs up")
def s84(t0, t1):
    fire_house(t0, t1)
    H = hero(t0, t1, "relief", short=True)
    H.pose(t0, loc=HERO_P, rot=180)
    H.act(t0 + 0.05, "wave", 0.5, expr="relief")
    tg = up(HERO_P, 4.3)
    cam = Cam()
    cam.push(t0, t1, tg, 6.5, 5.0, yaw=170, pitch=3, lens=28)
    cam.handheld(0.7)
    sfx(t0 + 0.05, "sigh", 0.6)


# ================================================================== SORRY (86-93s)
@S(85, 289, 294, "Then came the hardest part: he gulps, sweat drop, slow push")
def s85(t0, t1):
    fire_house(t0, t1, tramp=True, fire=0.6)
    H = hero(t0, t1, "worried", short=True)
    hp = (2.5, -6.5, 0)
    H.pose(t0, loc=hp, rot=160)
    H.face(w(292), "shock")
    drop = sphere("sweat", 0.16, (hp[0] + 0.5, hp[1] + 0.35, 5.0), M("sweat", "#7cc8ff", 0.05, emit=hexc("#7cc8ff"), estr=0.6),
                  (0.8, 0.8, 1.3), seg=10)
    pop_in(drop, w(292), 1.0)
    keyloc(drop, w(292) + 0.25, (hp[0] + 0.5, hp[1] + 0.35, 5.0))
    keyloc(drop, t1, (hp[0] + 0.55, hp[1] + 0.35, 4.2))
    tg = up(hp, 4.3)
    cam = Cam()
    cam.push(t0, t1, tg, 6.0, 4.0, yaw=170, pitch=2, lens=28)
    cam.handheld(0.6)
    sfx(w(292), "gulp", 0.8)


def sorry_shot(t0, t1, n):
    fire_house(t0, t1, tramp=True, fire=0.6)
    Cs = chicken("chs", (0, TRAMP[1], 2.4), 1.25, balloon=True, stone=True)
    H = hero(t0, t1, "worried", short=True)
    hp = (1.5, -6.5, 0)
    H.pose(t0, loc=hp, rot=170)
    H.pose(t0 + 0.15, torso=(0, 16 + n * 4, 0), head=(0, -6, 0))
    H.face(t0 + 0.15, eyes="closed", mouth="talk")
    lips(H, t0, t1)
    txt = ["I'M\nSORRY!", "SO\nSORRY!", "REALLY\nSORRY!"][n]
    shout(f"bub{n}", txt, (hp[0] - 0.6, hp[1] + 0.3, 7.8), t0 + 0.08, size=0.5, yaw=180 + (n - 1) * 10)
    cam = Cam()
    if n == 0:
        cam.key(t0, (-6, 1.5, 5), (1.0, -5.5, 4.4), lens=24, focus=10.0, fstop=5)
        cam.key(t1, (-5, 0.5, 5), (1.2, -5.5, 4.6), lens=24, focus=9.0, fstop=5)
    elif n == 1:
        cam.key(t0, (hp[0] + 4, hp[1] + 5, 4.5), up(hp, 4.0), lens=26, focus=up(hp, 4), fstop=4)
        cam.key(t1, (hp[0] + 3, hp[1] + 4.5, 5.0), up(hp, 4.0), lens=28, focus=up(hp, 4), fstop=4)
    else:
        cam.key(t0, (9, 2, 8), (0.5, -4.5, 4.0), lens=24, focus=12.0, fstop=6)
        cam.key(t1, (7.5, 1, 7), (0.5, -4.5, 4.2), lens=24, focus=11.0, fstop=6)
    cam.handheld(0.7)


@S(86, 294, 299, "I'm sorry you're a chicken.")
def s86(t0, t1):
    sorry_shot(t0, t1, 0)


@S(87, 299, 304, "I'm sorry you're an airhead.")
def s87(t0, t1):
    sorry_shot(t0, t1, 1)


@S(88, 304, 311, "And I'm really sorry you're a rock.")
def s88(t0, t1):
    sorry_shot(t0, t1, 2)


def undo_shot(t0, t1, stage):
    """stage 0: stone -> colour, 1: balloon -> chicken head, 2: chicken -> sister."""
    fire_house(t0, t1, tramp=True, fire=0.5)
    tp = t0 + 0.04
    base = (0, TRAMP[1], 2.4)
    if stage == 0:
        a = chicken("cha", base, 1.25, balloon=True, stone=True)
        b = chicken("chb", base, 1.25, balloon=True)
        vis(a["root"], [(tp, False)])
        vis(b["root"], [(tp, True)])
    elif stage == 1:
        b = chicken("chb", base, 1.25, balloon=True)
        keyscale(b["hd"], tp - FR, 0.001)
        keyscale(b["hd"], tp, 1.0)
        keyscale(b["ball"], tp - FR, 1.0)
        keyscale(b["ball"], tp, 0.001)
    else:
        b = chicken("chb", base, 1.25)
        vis(b["root"], [(tp, False)])
        Sx = sis(t0, t1, "gasp", sooty=True)
        Sx.pose(t0, loc=(0, TRAMP[1], 2.4), rot=0)
        W2.appear(Sx, tp, t0)
    W2.poof("pf", up(base, 3.6), tp, 1.0 + 0.2 * stage, seed=stage)
    flash(tp, 0.8, 0.18)
    cam = Cam()
    tg = up(base, 3.8)
    yaw = (-20, 18, 0)[stage]
    cam.push(t0, t1, tg, 9.0 - stage, 8.0 - stage, yaw=yaw, pitch=5, lens=24 + stage * 3)
    cam.crash(tp, 24 + stage * 3, 28 + stage * 3, 0.08)
    cam.handheld(1.8)
    sfx(tp, "poof")


@S(89, 311, 312, "Poof! (stone gone)")
def s89(t0, t1):
    undo_shot(t0, t1, 0)


@S(90, 312, 313, "Poof! (balloon gone)")
def s90(t0, t1):
    undo_shot(t0, t1, 1)


@S(91, 313, 314, "Poof! (sister back)")
def s91(t0, t1):
    undo_shot(t0, t1, 2)


@S(92, 314, 318, "My sister was back: she jumps off the trampoline, sooty, relieved")
def s92(t0, t1):
    fire_house(t0, t1, tramp=True, fire=0.4)
    Sx = sis(t0, t1, "relief", sooty=True)
    Sx.pose(t0, loc=(0, TRAMP[1], 2.4), rot=0)
    acting.jump(Sx, t0 + 0.1, 1.6, 0.5, loc=(0, TRAMP[1] - 3.5, 0))
    Sx.pose(t0 + 0.65, loc=(0, TRAMP[1] - 3.5, 0))
    Sx.act(t0 + 0.7, "cheer", 0.7, expr="joy")
    tg = (0, TRAMP[1] - 3.5, 4.4)
    cam = Cam()
    cam.push(t0, t1, tg, 9.0, 6.5, yaw=10, pitch=3, lens=26)
    cam.handheld(0.8)
    sfx(t0 + 0.6, "thud", 0.5)
    sfx(t0 + 0.7, "sparkle", 0.5)


@S(93, 318, 323, "She hugged me so hard: bear hug, his eyes bulge, squeeze")
def s93(t0, t1):
    fire_house(t0, t1, tramp=True, fire=0.4)
    hp = (1.0, -6.0, 0)
    H = hero(t0, t1, "shock", short=True)
    H.pose(t0, loc=hp, rot=180)
    Sx = sis(t0, t1, "joy", sooty=True)
    sp = (1.0, -4.6, 0)
    Sx.pose(t0, loc=sp, rot=0)
    Sx.pose(t0 + 0.1, armL=(80, -40), armR=(80, -40), torso=(0, 18, 0))
    H.pose(t0 + 0.1, armL=(20, 30), armR=(20, 30))
    keyscale(H.torso, w(321), (1, 1, 1))
    keyscale(H.torso, w(322), (0.82, 0.9, 1.0))
    H.face(w(321), eyes="terror", mouth="grimace_wide")
    tg = (1.0, -5.3, 4.6)
    cam = Cam()
    cam.push(t0, t1, tg, 8.0, 6.5, yaw=95, pitch=4, lens=26)
    cam.handheld(1.0)
    sfx(w(321), "squeeze", 0.7)


@S(94, 323, 327, "my glasses fell off: close insert, glasses slide off his face and tumble down")
def s94(t0, t1):
    fire_house(t0, t1, tramp=True, fire=0.4)
    hp = (1.0, -6.0, 0)
    H = hero(t0, t1, "terror", short=True)
    H.pose(t0, loc=hp, rot=180)
    sp = H.specs
    tf = w(325)
    keyloc(sp, tf, (0, 0, 0))
    keyrot(sp, tf, (0, 0, 0))
    keyloc(sp, tf + 0.25, (0.2, -0.5, -0.7))
    keyrot(sp, tf + 0.25, (30, 10, 20))
    keyloc(sp, t1, (0.6, -1.4, -3.6), "LINEAR")
    keyrot(sp, t1, (140, 50, 160))
    tg = up(hp, 4.62 * 0.92 - 0.6)
    cam = Cam()
    cam.key(t0, orbit_pos(tg, 4.8, 150, 4), tg, lens=28, focus=tg, fstop=2.8)
    cam.key(t1, orbit_pos(up(tg, -1.2), 4.6, 145, 2), up(tg, -1.6), lens=28, focus=tg, fstop=2.8)
    cam.handheld(0.6)
    sfx(tf + 0.05, "whoosh", 0.4)
    sfx(t1 - 0.15, "clink", 0.8)


@S(95, 327, 332, "Then she smiled and said: her warm smile, close")
def s95(t0, t1):
    fire_house(t0, t1, tramp=True, fire=0.3)
    sp = (1.0, -4.6, 0)
    Sx = sis(t0, t1, "smile", sooty=True)
    Sx.pose(t0, loc=sp, rot=180)
    Sx.face(w(329), "grin")
    tg = up(sp, 4.85)
    cam = Cam()
    cam.push(t0, t1, tg, 5.5, 4.0, yaw=180, pitch=2, lens=30)
    cam.handheld(0.6)


@S(96, 332, 334, "Thanks, nerd.: smirk, wink, bubble")
def s96(t0, t1):
    fire_house(t0, t1, tramp=True, fire=0.3)
    sp = (1.0, -4.6, 0)
    Sx = sis(t0, t1, "smug", sooty=True)
    Sx.pose(t0, loc=sp, rot=180)
    lips(Sx, t0, t1)
    Sx.face(w(333) + 0.15, "wink")
    shout("bub", "THANKS,\nNERD!", (sp[0] + 0.2, sp[1] + 1.2, 6.7), t0 + 0.04, size=0.36, yaw=180)
    tg = up(sp, 4.85)
    cam = Cam()
    cam.push(t0, t1, tg, 7.0, 6.0, yaw=170, pitch=2, lens=28, look=up(sp, 5.6))
    cam.handheld(0.8)


@S(97, 334, 335, "Poof!: on the narrator")
def s97(t0, t1):
    fire_house(t0, t1, tramp=True, fire=0.3)
    hp = (1.0, -6.0, 0)
    H = hero(t0, t1, "bored", short=True, glasses=False)
    H.pose(t0, loc=hp, rot=180)
    tp = t0 + 0.04
    W2.poof("pf", up(hp, 4.4), tp, 0.9)
    flash(tp, 1.2, 0.2)
    tg = up(hp, 4.3)
    cam = Cam()
    cam.push(t0, t1, tg, 6.0, 5.2, yaw=180, pitch=2, lens=28)
    cam.crash(tp, 28, 34, 0.08)
    cam.handheld(1.8)
    sfx(tp, "poof")


@S(98, 335, None, "New glasses.: giant comic glasses, dead-pan, slow push, rimshot")
def s98(t0, t1):
    fire_house(t0, t1, tramp=True, fire=0.3)
    hp = (1.0, -6.0, 0)
    H = hero(t0, t1, "bored", short=True, glasses=False)
    H.pose(t0, loc=hp, rot=180)
    nerd_glasses(H, big=True, name="bigspecs")
    H.face(t0 + 0.4, eyes="closed")
    H.face(t0 + 0.47, "bored")
    tg = up(hp, 4.62 * 0.92)
    cam = Cam()
    cam.push(t0, t1, tg, 5.0, 3.6, yaw=180, pitch=0, lens=30)
    cam.handheld(0.5)
    sfx(t0 + 0.1, "rimshot", 0.7)
