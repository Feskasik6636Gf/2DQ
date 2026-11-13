"""story: "Every sneeze teleports you to whatever you were thinking about."  Sam, Mia and the stray cat.
~78 shots keyed to script word indices (see audio/words.json)."""
from shotkit import *
from rbx import story
from rbx.story import *
import math, random
import bpy
from mathutils import Vector
from rbx.sets import planks, wood, checker_mat

V = Video(__file__)
story.bind(V)


# ================================================================== small helpers
def flash(t, amt=2.2, dur=0.28):
    """Global exposure punch (white flash) at t."""
    vs = bpy.context.scene.view_settings
    vs.exposure = 0.0
    vs.keyframe_insert("exposure", frame=max(1, F(t) - 1))
    vs.exposure = amt
    vs.keyframe_insert("exposure", frame=F(t))
    vs.exposure = 0.0
    vs.keyframe_insert("exposure", frame=F(t + dur))


def pop_in(ob, t, s=1.0, over=1.2):
    """Scale pop with overshoot (hidden before t)."""
    ob.scale = (0.001,) * 3
    ob.keyframe_insert("scale", frame=max(1, F(t) - 1))
    ob.scale = (s * over,) * 3
    ob.keyframe_insert("scale", frame=F(t + 0.1))
    ob.scale = (s * 0.95,) * 3
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


def hide_tree(root, t, vis=False, t_before=None):
    obs = [root] + list(root.children_recursive)
    tb = t_before if t_before is not None else t - 1.0 / 30
    for ob in obs:
        sets.set_obj_visible(ob, tb, not vis)
        sets.set_obj_visible(ob, t, vis)


def M(name, c, rough=0.6, **kw):
    return mat(name, hexc(c) if isinstance(c, str) else c, rough, **kw)


def label(name, body, loc, size, color="#ffffff", rot=(90, 0, 0), extrude=0.06, estr=0.0, parent=None, coll=None):
    m = mat("txt_" + color + str(estr), hexc(color), 0.4, emit=hexc(color) if estr else None, estr=estr)
    return text(name, body, loc, size, m, rot=rot, extrude=extrude, parent=parent, coll=coll,
                font=kit_font())


_FONT = None


def kit_font():
    global _FONT
    if _FONT is None:
        import glob, os
        c = glob.glob(os.path.expanduser("~/.fonts/TitanOne-Regular.ttf"))
        _FONT = c[0] if c else None
    return _FONT


# ================================================================== cast
def sam(t0, t1, expr="neutral", **kw):
    return eddie(t0, t1, expr, name="Sam", **kw)


def mia(t0, t1, expr="happy", scale=0.78):
    return story._live(chars.Char("Mia", skin="#f2dbc6", shirt="#f06aa8", pants="#7a5ab0", hair="bob",
                                  hair_color="#5a3a22", face="girl", sleeves="long", scale=scale), t0, t1, expr)


def mom(t0, t1, expr="neutral"):
    return story._live(chars.Char("Mom", skin="#f1dfc6", shirt="#4fb3a0", pants="#3d4a6a", hair="bob",
                                  hair_color="#4a2e1c", face="girl", sleeves="long"), t0, t1, expr)


def granny(t0, t1, expr="smile"):
    return story._live(chars.Char("Granny", skin="#f2dcc8", shirt="#9a6ad6", pants="#6a5a8a", hair="bun",
                                  hair_color="#e4e4e4", face="girl", sleeves="long", extras=("glasses",)), t0, t1, expr)


def papa(t0, t1, expr="neutral"):
    return story._live(chars.Char("Papa", skin="#efd9c0", shirt="#7fa8e0", shirt_kind="stripes", shirt_c2="#eef3fb",
                                  pants="#7fa8e0", pants_kind="stripes", pants_c2="#eef3fb", hair="short",
                                  hair_color="#5a3a22", face="mustache", sleeves="long", extras=("glasses",)),
                       t0, t1, expr)


def groom(t0, t1, expr="happy"):
    return story._live(chars.Char("Groom", skin="#e9c7a6", shirt="#22232a", pants="#22232a", hair="slick",
                                  hair_color="#3a2414", face="mustache", sleeves="long",
                                  extras=("collar:#f4f4f4",)), t0, t1, expr)


def bride(t0, t1, expr="happy"):
    B = story._live(chars.Char("Bride", skin="#f2dbc6", shirt="#fbfbff", pants="#fbfbff", hair="bun",
                               hair_color="#b0703a", face="girl", sleeves="long"), t0, t1, expr)
    box("Bride_veil", (1.7, 0.3, 2.2), (0, 0.55, 0.0), mat("veil", (1, 1, 1), 0.4, alpha=0.55), 0.1,
        parent=B.head, coll=B.coll)
    return B


def worker(t0, t1, i=0, expr="neutral", shirt="#e8574a"):
    return story._live(chars.Char(f"Worker{i}", skin=["#d9b48f", "#a8714a", "#f1dfc6"][i % 3], shirt=shirt,
                                  pants="#2a2d36", hair="cap", hair_color="#e8574a" if i == 0 else "#2a5ad0",
                                  face="plain", extras=("collar:#f4f4f4",)), t0, t1, expr)


def searcher(i, t0, t1, expr="worried"):
    S_ = story._live(chars.Char(f"Search{i}", skin=["#d9b48f", "#a8714a", "#f1dfc6", "#7a4e33"][i % 4],
                                shirt="#ff7a1a", pants="#2a2d36", hair="helmet", hair_color="#f2c14e",
                                face="plain", sleeves="long", vneck="#d7d34a"), t0, t1, expr)
    S_.pose(t0, armR=(80, -6))
    tor = cyl(f"Search{i}_torch", 0.18, 0.7, (0, 0, -1.75), M("torch", "#2a2a2e", 0.3), 12, parent=S_.shR,
              coll=S_.coll)
    lt = light(f"Search{i}_beam", "SPOT", (0, 0, -2.1), 2500, (1.0, 0.93, 0.75), 0.1, coll=S_.coll, spot=28)
    lt.parent = S_.shR
    lt.rotation_euler = (0, 0, 0)  # spot points -Z in shoulder space = along the arm
    beam = cyl(f"Search{i}_cone", 0.12, 9.0, (0, 0, -6.6), mat("beam", (1.0, 0.95, 0.8), 0.5, emit=(1.0, 0.95, 0.8),
               estr=1.2, alpha=0.12), 16, parent=S_.shR, coll=S_.coll, r2=2.4)
    beam.rotation_euler = (math.radians(180), 0, 0)
    return S_


# ================================================================== props
def stray_cat(name="cat", loc=(0, 0, 0), rot=0, scale=0.6, sit=True):
    return W2.cat(name, loc, color="#9aa0aa", rot=rot, scale=scale, sit=sit)


def hold_cat(ch, name="cat", scale=0.55, local=(0, -0.95, 0.35)):
    c = stray_cat(name, (0, 0, 0), scale=scale)
    c.parent = ch.hip
    c.location = local
    return c


def red_nose(ch):
    return sphere(ch.name + "_rednose", 0.15, (0, -0.63, -0.08), M("rednose", "#e0403a", 0.3), parent=ch.head,
                  coll=ch.coll)


def pill_bottle(name, loc, s=1.0, coll=None):
    r = empty(name, loc, coll=coll)
    r.scale = (s,) * 3
    cyl(name + "_b", 0.55, 1.5, (0, 0, 0.75), mat("pillorange", hexc("#f08a24"), 0.15, alpha=0.8), 24, parent=r, coll=coll)
    cyl(name + "_c", 0.6, 0.4, (0, 0, 1.65), M("pillcap", "#f4f4f4", 0.3), 24, parent=r, coll=coll)
    card(name + "_l", 0.95, 0.7, (0, -0.56, 0.75), M("pilllabel", "#fbfbf6", 0.6), "-Y", parent=r, coll=coll)
    return r


def pill(name, loc, s=1.0, coll=None, rot=(0, 0, 0)):
    r = empty(name, loc, coll=coll, rot=rot)
    r.scale = (s,) * 3
    for k, (c, z) in enumerate((("#e8463a", 0.25), ("#f4f4f4", -0.25))):
        cyl(f"{name}_{k}", 0.25, 0.5, (0, 0, z), M("pill" + c, c, 0.25), 16, parent=r, coll=coll)
        sphere(f"{name}_e{k}", 0.25, (0, 0, z * 2), M("pill" + c, c, 0.25), parent=r, coll=coll, seg=12)
    return r


def grinder(name, loc, s=1.0, coll=None, parent=None):
    r = empty(name, loc, coll=coll, parent=parent)
    r.scale = (s,) * 3
    Mw = wood("grinder_wood", "#4a2a18", "#6e4229", 3.0)
    cyl(name + "_body", 0.45, 1.8, (0, 0, 0.9), Mw, 24, bev=0.05, parent=r, coll=coll)
    cyl(name + "_neck", 0.32, 0.3, (0, 0, 1.95), Mw, 24, parent=r, coll=coll)
    top = empty(name + "_toppiv", (0, 0, 2.1), parent=r, coll=coll)
    sphere(name + "_top", 0.42, (0, 0, 0.15), Mw, (1, 1, 0.6), parent=top, coll=coll, seg=20)
    cyl(name + "_knob", 0.12, 0.3, (0, 0, 0.45), M("grinder_metal", "#c8ccd2", 0.2, metal=1.0), 12, parent=top, coll=coll)
    return r


def pepper_cloud(name, src, dst, t0, t1, n=40, seed=1, size=0.07, coll=None):
    """Black pepper specks streaming from src to dst (sucked in)."""
    rnd = random.Random(seed)
    Mp = M("pepper_speck", "#1a1612", 0.8)
    for i in range(n):
        st = t0 + (t1 - t0 - 0.35) * i / n
        a = Vector(src) + Vector([rnd.uniform(-0.8, 0.8) for _ in range(3)])
        s = sphere(f"{name}{i}", size * rnd.uniform(0.7, 1.4), tuple(a), Mp, coll=coll, seg=6)
        s.scale = (0.01,) * 3
        s.keyframe_insert("scale", frame=max(1, F(st) - 1))
        s.scale = (1, 1, 1)
        s.keyframe_insert("scale", frame=F(st))
        keyloc(s, st, tuple(a), "LINEAR")
        mid = (Vector(a) + Vector(dst)) / 2 + Vector((rnd.uniform(-0.6, 0.6), rnd.uniform(-0.6, 0.6), 0.4))
        keyloc(s, st + 0.18, tuple(mid), "LINEAR")
        keyloc(s, st + 0.34, tuple(dst), "LINEAR")
        s.scale = (0.01,) * 3
        s.keyframe_insert("scale", frame=F(st + 0.36))


def tears(ch, t0, t1, n=14, seed=2):
    """Tear drops spraying sideways from both eyes."""
    rnd = random.Random(seed)
    Mt = mat("tear", hexc("#7cc8ff"), 0.05, emit=hexc("#7cc8ff"), estr=0.6, alpha=0.85)
    for sx in (-1, 1):
        for i in range(n):
            st = t0 + (t1 - t0) * i / n
            s = sphere(f"{ch.name}_tear{sx}{i}", 0.12, (sx * 0.35, -0.62, 0.1), Mt, (0.8, 0.8, 1.2), parent=ch.head,
                       coll=ch.coll, seg=8)
            s.scale = (0.01,) * 3
            s.keyframe_insert("scale", frame=max(1, F(st) - 1))
            s.scale = (1, 1, 1)
            s.keyframe_insert("scale", frame=F(st))
            keyloc(s, st, (sx * 0.35, -0.62, 0.1), "LINEAR")
            keyloc(s, st + 0.2, (sx * rnd.uniform(1.2, 1.8), -0.7, 0.3), "LINEAR")
            keyloc(s, st + 0.42, (sx * rnd.uniform(2.0, 2.8), -0.7, -0.9), "LINEAR")
            s.scale = (0.01,) * 3
            s.keyframe_insert("scale", frame=F(st + 0.45))


def donut(name, loc, s=1.0, coll=None, parent=None):
    bpy.ops.mesh.primitive_torus_add(major_radius=1.0, minor_radius=0.45, location=(0, 0, 0))
    d = bpy.context.active_object
    d.name = name
    for c_ in d.users_collection:
        c_.objects.unlink(d)
    from rbx.core import _link
    _link(d, coll)
    d.data.materials.append(M("dough", "#d99a54", 0.6))
    bpy.ops.object.select_all(action="DESELECT")
    ic = sphere(name + "_icing", 1.0, (0, 0, 0.18), M("icing", "#f59bc8", 0.35), (1.42, 1.42, 0.35), parent=d, coll=coll)
    hole = cyl(name + "_hole", 0.55, 1.2, (0, 0, 0), M("hole_dark", "#d99a54", 0.6), 20, parent=d, coll=coll)
    for i in range(10):
        a = i * 0.63
        box(f"{name}_spr{i}", (0.28, 0.07, 0.07), (math.cos(a) * 0.95, math.sin(a) * 0.95, 0.5),
            M("spr" + str(i % 3), ["#4ab0f0", "#f2e04e", "#ffffff"][i % 3], 0.4), 0.02, parent=d, coll=coll,
            rot=(0, 0, i * 47))
    d.location = loc
    d.scale = (s,) * 3
    d.rotation_euler = (math.radians(70), 0, 0)
    d.parent = parent
    return d


def sandwich(name, loc, s=1.0, coll=None, parent=None):
    r = empty(name, loc, coll=coll, parent=parent)
    r.scale = (s,) * 3
    layers = [("#e0b070", 0.45, 2.4), ("#5fbf4a", 0.12, 2.6), ("#e04a3a", 0.16, 2.3), ("#f6d24a", 0.1, 2.5),
              ("#d98a8a", 0.18, 2.35), ("#e0b070", 0.5, 2.4)]
    z = 0
    for i, (c, h, w_) in enumerate(layers):
        box(f"{name}_l{i}", (w_, 1.5, h), (0, 0, z + h / 2), M("sand" + c, c, 0.6), 0.12 if i in (0, 5) else 0.03,
            parent=r, coll=coll)
        z += h
    return r


def pizza(name, loc, s=1.0, coll=None, parent=None, rot=(0, 0, 0)):
    r = empty(name, loc, coll=coll, parent=parent, rot=rot)
    r.scale = (s,) * 3
    poly_extrude(name + "_dough", [(-1.0, 1.6), (1.0, 1.6), (0, -1.0)], 0.18, (0, 0, 0), M("crust", "#f2c46a", 0.6),
                 rot=(0, 0, 0), parent=r, coll=coll)
    poly_extrude(name + "_sauce", [(-0.85, 1.4), (0.85, 1.4), (0, -0.8)], 0.06, (0, 0, 0.12), M("cheese", "#ffd24a", 0.4),
                 rot=(0, 0, 0), parent=r, coll=coll)
    box(name + "_crustedge", (2.1, 0.4, 0.35), (0, 1.6, 0.1), M("crust", "#e0a050", 0.6), 0.15, parent=r, coll=coll)
    for i, (x, y) in enumerate(((-0.35, 0.9), (0.35, 0.6), (0.0, 0.1), (-0.15, 1.25))):
        cyl(f"{name}_pep{i}", 0.2, 0.06, (x, y, 0.2), M("pepperoni", "#c8321e", 0.4), 16, parent=r, coll=coll)
    return r


def giraffe(name, loc, rot=0, s=1.0, coll=None):
    r = empty(name, loc, coll=coll, rot=(0, 0, rot))
    r.scale = (s,) * 3
    Y, B = M("giraffe_y", "#f2b84a", 0.6), M("giraffe_b", "#8a4a20", 0.6)
    box(name + "_body", (2.4, 4.0, 2.2), (0, 0, 5.6), Y, 0.4, parent=r, coll=coll)
    for sx in (-1, 1):
        for sy in (-1, 1):
            box(f"{name}_leg{sx}{sy}", (0.55, 0.55, 4.6), (sx * 0.8, sy * 1.4, 2.3), Y, 0.15, parent=r, coll=coll)
            box(f"{name}_hoof{sx}{sy}", (0.6, 0.6, 0.35), (sx * 0.8, sy * 1.4, 0.17), B, 0.08, parent=r, coll=coll)
    neck = empty(name + "_neckpiv", (0, -1.6, 6.4), parent=r, coll=coll, rot=(-18, 0, 0))
    box(name + "_neck", (0.9, 0.9, 5.4), (0, 0, 2.6), Y, 0.25, parent=neck, coll=coll)
    head = empty(name + "_headpiv", (0, 0, 5.4), parent=neck, coll=coll, rot=(18, 0, 0))
    box(name + "_head", (1.0, 1.9, 0.95), (0, -0.55, 0.3), Y, 0.3, parent=head, coll=coll)
    for sx in (-1, 1):
        cyl(f"{name}_oss{sx}", 0.1, 0.6, (sx * 0.25, 0.1, 1.05), B, 8, parent=head, coll=coll)
        sphere(f"{name}_eye{sx}", 0.12, (sx * 0.52, -0.6, 0.55), M("g_eye", "#151515", 0.3), parent=head, coll=coll, seg=10)
    rnd = random.Random(3)
    for i in range(16):
        side = rnd.choice((-1, 1))
        box(f"{name}_spot{i}", (0.05, rnd.uniform(0.5, 0.9), rnd.uniform(0.4, 0.7)),
            (side * 1.21, rnd.uniform(-1.6, 1.6), rnd.uniform(4.9, 6.4)), B, 0.02, parent=r, coll=coll)
    noise(neck, "rotation_euler", 1, 0.06, 30)
    noise(head, "rotation_euler", 0, 0.08, 24)
    return r


def bubble(name, center, t_on, t_off=None, s=1.0, tail_to=None, coll=None):
    """Thought bubble (cloud of white spheres + trail dots). Returns content root (in front of the cloud)."""
    root = empty(name, center, coll=coll)
    Mb = mat("bubble_white", (0.98, 0.98, 1.0), 0.7, emit=(0.9, 0.92, 1.0), estr=0.35)
    rnd = random.Random(len(name))
    for i in range(9):
        a = i / 9 * math.tau
        sphere(f"{name}_c{i}", rnd.uniform(1.0, 1.3), (math.cos(a) * 1.7, 0.3, math.sin(a) * 1.15), Mb, (1, 0.5, 1),
               parent=root, coll=coll, seg=16)
    sphere(f"{name}_core", 1.9, (0, 0.4, 0), Mb, (1.1, 0.4, 0.8), parent=root, coll=coll, seg=20)
    pop_in(root, t_on, s)
    if t_off:
        shrink_out(root, t_off, s)
    sfx(t_on, "pop", 0.7)
    if tail_to is not None:
        for k, f in enumerate((0.35, 0.62)):
            p = Vector(tail_to).lerp(Vector(center), f)
            d = sphere(f"{name}_dot{k}", 0.22 + 0.15 * k, tuple(p), Mb, coll=coll, seg=12)
            pop_in(d, t_on - 0.08 + k * 0.05, 1.0)
            if t_off:
                shrink_out(d, t_off)
    content = empty(name + "_content", (0, -0.9, 0), parent=root, coll=coll)
    return content


# ================================================================== sets
def night_world(strength=0.55):
    W.sky(strength, top=(0.01, 0.02, 0.08), bottom=(0.07, 0.12, 0.3))


def snowfall(name, center, size=(26, 26, 14), t0=0.0, t1=1.0, n=220, wind=1.5, speed=3.0, seed=1, flake=0.07):
    rnd = random.Random(seed)
    Ms = mat("flake", (1, 1, 1), 0.5, emit=(0.85, 0.9, 1.0), estr=0.7)
    dur = t1 - t0 + 0.3
    fall = speed * dur
    for i in range(n):
        x = center[0] + rnd.uniform(-size[0] / 2, size[0] / 2)
        y = center[1] + rnd.uniform(-size[1] / 2, size[1] / 2)
        z = center[2] + rnd.uniform(0, size[2] + fall)
        s = sphere(f"{name}{i}", flake * rnd.uniform(0.6, 1.5), (x, y, z), Ms, coll=None, seg=6)
        keyloc(s, t0 - 0.1, (x, y, z), "LINEAR")
        keyloc(s, t1 + 0.2, (x + wind * dur * rnd.uniform(0.7, 1.3), y, z - fall * rnd.uniform(0.8, 1.2)), "LINEAR")
        noise(s, "location", 0, 0.3, 12)


def pine(name, loc, h=10.0, coll=None, snowy=True):
    r = empty(name, loc, coll=coll)
    cyl(name + "_tr", 0.45 * h / 10, h * 0.25, (0, 0, h * 0.12), M("bark", "#4a2e1c", 0.9), 10, parent=r, coll=coll)
    G = M("pine_dk", "#1f4a36", 0.85)
    Sn = M("snow_cap", "#eef4ff", 0.7)
    for k in range(3):
        rr = h * (0.36 - k * 0.09)
        z = h * (0.32 + k * 0.2)
        cyl(f"{name}_c{k}", rr, h * 0.34, (0, 0, z), G, 12, parent=r, coll=coll, r2=0.05)
        if snowy:
            cyl(f"{name}_s{k}", rr * 0.62, h * 0.14, (0, 0, z + h * 0.11), Sn, 12, parent=r, coll=coll, r2=0.05)
    return r


def snow_forest(seed=4, clear=13.0, cabin=False, dark=False, moon=True):
    c = collection("FOREST")
    night_world(0.35 if dark else 0.6)
    Mg = M("snow_ground", "#dfe8f7", 0.85)
    box("sf_ground", (400, 400, 0.4), (0, 0, -0.2), Mg, 0, coll=c)
    rnd = random.Random(seed)
    for i in range(26):
        p = (rnd.uniform(-40, 40), rnd.uniform(-20, 60), -0.4)
        if math.hypot(p[0], p[1]) < clear:
            continue
        sphere(f"sf_mound{i}", rnd.uniform(1.5, 3.5), p, Mg, (1.6, 1.2, 0.45), coll=c, seg=16)
    k = 0
    for i in range(140):
        x, y = rnd.uniform(-70, 70), rnd.uniform(-35, 110)
        d = math.hypot(x, y)
        if d < clear or (y < 2 and abs(x) < 16 and d < 30):
            continue
        pine(f"sf_pine{k}", (x, y, 0), rnd.uniform(9, 17), coll=c)
        k += 1
    if cabin:
        hx, hy = 14, 22
        box("cab_body", (12, 9, 7), (hx, hy, 3.5), wood("cabin_wood", "#6e4229", "#8c5a3a", 1.0), 0.1, coll=c)
        poly_extrude("cab_roof", [(-7.2, 0), (7.2, 0), (0, 5)], 10.0, (hx, hy + 5, 7), M("roof_snow", "#eef4ff", 0.7),
                     rot=(90, 0, 0), coll=c)
        for sx in (-1, 1):
            card(f"cab_win{sx}", 2.2, 2.2, (hx + sx * 3, hy - 4.52, 4.2),
                 mat("cab_window", hexc("#ffcc70"), 0.4, emit=hexc("#ffb84a"), estr=6.0), "-Y", coll=c)
        light("cab_glow", "POINT", (hx, hy - 6.5, 4.0), 900, (1.0, 0.7, 0.35), 2.0, coll=c)
    if moon:
        sphere("sf_moon", 7, (-40, 160, 70), mat("moon_glow", hexc("#f4f0d8"), 0.5, emit=hexc("#f4f0d8"), estr=4.0), coll=c)
    light("sf_moonlight", "SUN", (0, 0, 50), 0.9 if dark else 1.6, (0.55, 0.68, 1.0), 3, coll=c, rot=(55, 0, 160))
    return c


def night_rig(target, cam_side=(0, -14, 6), e=900):
    """Soft fill from the camera side + cold rim from behind so faces read at night."""
    light("nr_fill", "AREA", tuple(Vector(target) + Vector(cam_side)), e, (0.75, 0.82, 1.0), 10, target=target)
    light("nr_rim", "AREA", tuple(Vector(target) + Vector((4, 12, 8))), e * 1.4, (0.6, 0.75, 1.0), 6, target=target)


def town_day():
    town_scene()


def shop(kind="subs"):
    """Small shop interior: counter (front at y=1.8), back wall y=9. kind: subs, donuts, pharmacy."""
    c = collection("SHOP")
    world((0.9, 0.9, 0.95), 0.5)
    box("sh_floor", (40, 30, 0.4), (0, 0, -0.2), checker_mat("sh_floor", "#f2f2f2", "#d9453a" if kind != "pharmacy" else "#7ac0a0", 0.25), 0, coll=c)
    wall = {"subs": "#f6e2b8", "donuts": "#fbd7e6", "pharmacy": "#e4f4ee"}[kind]
    box("sh_back", (40, 0.5, 16), (0, 9.25, 8), M("sh_wall", wall, 0.85), 0, coll=c)
    box("sh_counter", (14, 2.8, 3.6), (0, 3.2, 1.8), M("sh_ctr", {"subs": "#2f7a3a", "donuts": "#e86aa0", "pharmacy": "#f4f4f4"}[kind], 0.5), 0.08, coll=c)
    box("sh_top", (14.4, 3.1, 0.3), (0, 3.2, 3.75), M("sh_top", "#e8e8ea", 0.25), 0.05, coll=c)
    if False:
        box("sh_glass", (9, 0.1, 1.6), (-1.5, 1.85, 4.7), mat("sh_glass", (0.85, 0.95, 1.0), 0.05, alpha=0.25, spec=1.0), 0.02, coll=c)
    # shelves
    rnd = random.Random(7)
    for row in range(3):
        box(f"sh_shelf{row}", (16, 1.2, 0.25), (0, 8.4, 6.2 + row * 2.4), wood("sh_wood", "#a0703f", "#c89260", 2.0), 0.03, coll=c)
        for q in range(12):
            col = ["#e8574a", "#4aa5e8", "#f2c14e", "#63c06a", "#f09ac2", "#ffffff"][rnd.randrange(6)]
            h = rnd.uniform(0.9, 1.6)
            box(f"sh_item{row}{q}", (0.9, 0.8, h), (-7 + q * 1.27, 8.3, 6.35 + row * 2.4 + h / 2), M("it" + col, col, 0.5), 0.05, coll=c)
    title = {"subs": "OHIO SUBS", "donuts": "DONUTS", "pharmacy": "PHARMACY"}[kind]
    col = {"subs": "#d9453a", "donuts": "#e04a90", "pharmacy": "#2a9a5a"}[kind]
    label("sh_title", title, (0, 8.95, 13.6), 2.2, col, extrude=0.15)
    if kind == "pharmacy":
        for r_ in ((0, 0), (90, 0)):
            box(f"sh_cross{r_[0]}", (2.4, 0.3, 0.8), (-9.5, 8.9, 13.6), mat("crossg", hexc("#2acf6a"), 0.4, emit=hexc("#2acf6a"), estr=4),
                0.05, coll=c, rot=(0, r_[0], 0))
    light("sh_key", "AREA", (0, -6, 13), 5500, (1.0, 0.97, 0.92), 12, coll=c, target=(0, 4, 2))
    light("sh_fill", "AREA", (-9, -3, 6), 1600, (0.95, 0.95, 1.0), 6, coll=c, target=(0, 4, 3))
    return c


def airport():
    c = collection("AIRPORT")
    world((0.85, 0.9, 1.0), 0.6)
    box("ap_floor", (80, 80, 0.4), (0, 10, -0.2), checker_mat("ap_floor", "#d8dde4", "#c4cad3", 0.12, 0.15), 0, coll=c)
    box("ap_glass", (80, 0.3, 26), (0, 30, 13), mat("ap_sky", (0.55, 0.78, 1.0), 0.1, emit=(0.6, 0.8, 1.0), estr=1.6), 0, coll=c)
    for i in range(17):
        box(f"ap_mull{i}", (0.4, 0.6, 26), (-40 + i * 5, 29.6, 13), M("ap_mull", "#3a404a", 0.4), 0.02, coll=c)
    box("ap_board", (16, 0.6, 6.5), (-6, 18, 11), M("ap_board", "#15171c", 0.3), 0.1, coll=c)
    label("ap_bt", "DEPARTURES", (-6, 17.6, 13.4), 1.0, "#f2c14e", extrude=0.02, estr=3)
    for k in range(4):
        label(f"ap_l{k}", ["PARIS", "TOKYO", "ROME", "OHIO"][k], (-10.5, 17.6, 11.9 - k * 1.25), 0.8, "#ffffff", extrude=0.01, estr=2)
        label(f"ap_c{k}", "CANCELLED", (-2.5, 17.6, 11.9 - k * 1.25), 0.8, "#ff4a3a", extrude=0.01, estr=3)
    Mseat = M("ap_seat", "#2f6fd0", 0.4)
    for row in range(3):
        for q in range(8):
            x, y = -10 + q * 2.4, 2 + row * 4.5
            box(f"ap_s{row}{q}", (2.0, 1.8, 0.35), (x, y, 1.9), Mseat, 0.1, coll=c)
            box(f"ap_b{row}{q}", (2.0, 0.3, 2.0), (x, y + 0.85, 3.0), Mseat, 0.1, coll=c)
    light("ap_key", "AREA", (0, -8, 20), 9000, (1.0, 0.98, 0.95), 20, coll=c, target=(0, 10, 0))
    return c


def wedding():
    c = collection("WEDDING")
    W.sky(1.0)
    W.sun(3.5, rot=(50, 0, 30))
    box("wd_grass", (300, 300, 0.4), (0, 0, -0.2), M("grass", "#5fb04a", 0.9), 0, coll=c)
    box("wd_aisle", (3.0, 30, 0.08), (0, -8, 0.04), M("aisle", "#c8261e", 0.8), 0, coll=c)
    Mw = M("arch_white", "#fbfbf6", 0.4)
    for sx in (-1, 1):
        box(f"wd_pil{sx}", (0.8, 0.8, 9), (sx * 4.2, 9.5, 4.5), Mw, 0.1, coll=c)
    box("wd_top", (9.6, 1.0, 0.9), (0, 9.5, 9.2), Mw, 0.1, coll=c)
    rnd = random.Random(2)
    for i in range(40):
        a = rnd.random()
        p = (-4.2 + 8.4 * a, 9.2, 9.6 + rnd.uniform(-0.3, 0.5)) if i < 26 else (rnd.choice((-4.2, 4.2)), 9.0, rnd.uniform(1, 9))
        col = rnd.choice(["#f59bc8", "#ffffff", "#f2c14e", "#e8574a"])
        sphere(f"wd_fl{i}", rnd.uniform(0.35, 0.6), p, M("fl" + col, col, 0.5), coll=c, seg=12)
    for k in range(8):
        sphere(f"wd_bush{k}", 3.0, (-26 + k * 7.5, 22, 2), M("bush", "#3f8f3a", 0.9), (1, 1, 1.2), coll=c)
    light("wd_fill", "AREA", (0, -10, 10), 2500, (1.0, 0.97, 0.92), 12, coll=c, target=(0, 8, 3))
    return c


def savanna():
    c = collection("SAVANNA")
    W.sky(1.0, top=(0.1, 0.35, 0.85), bottom=(0.95, 0.7, 0.4))
    W.sun(4.5, rot=(40, 0, -40))
    box("sv_ground", (400, 400, 0.4), (0, 0, -0.2), M("savanna", "#d8b25a", 0.95), 0, coll=c)
    rnd = random.Random(9)
    for i in range(14):
        x, y = rnd.uniform(-80, 80), rnd.uniform(20, 120)
        cyl(f"sv_trunk{i}", 0.5, 7, (x, y, 3.5), M("bark", "#5a3a22", 0.9), 10, coll=c)
        sphere(f"sv_crown{i}", 5, (x, y, 7.8), M("acacia", "#5a8a2a", 0.9), (1.4, 1.4, 0.35), coll=c, seg=16)
    for i in range(16):
        x = -24 + i * 3.2
        box(f"sv_post{i}", (0.4, 0.4, 4), (x, 12, 2), M("fence", "#8a5a32", 0.8), 0.05, coll=c)
    for z in (1.4, 3.2):
        box(f"sv_rail{z}", (50, 0.25, 0.25), (0, 12, z), M("fence", "#8a5a32", 0.8), 0.05, coll=c)
    box("sv_sign", (7, 0.4, 2.6), (-8, 11.6, 5.6), M("sign_wood", "#7a4a2a", 0.7), 0.1, coll=c)
    label("sv_signt", "KENYA ZOO", (-8, 11.3, 5.6), 1.0, "#ffe9b0", extrude=0.03)
    box("sv_hay", (5, 3, 1.4), (1.5, 2.5, 0.7), M("hay", "#e8c860", 0.95), 0.4, coll=c)
    light("sv_fill", "AREA", (0, -12, 8), 2000, (1.0, 0.9, 0.8), 10, coll=c, target=(0, 3, 3))
    return c


def eiffel(name, loc, s=1.0, coll=None):
    r = empty(name, loc, coll=coll)
    r.scale = (s,) * 3
    Mi = M("eiffel_iron", "#7a5a3e", 0.6, metal=0.3)
    for sx in (-1, 1):
        for sy in (-1, 1):
            cyl(f"{name}_leg{sx}{sy}", 1.6, 13, (sx * 5.0, sy * 5.0, 6.0), Mi, 4, parent=r, coll=coll, r2=0.9,
                rot=(sy * 18, -sx * 18, 45))
    box(name + "_p1", (12, 12, 1.2), (0, 0, 12.5), Mi, 0.1, parent=r, coll=coll)
    cyl(name + "_mid", 4.2, 14, (0, 0, 20), Mi, 4, parent=r, coll=coll, r2=2.0, rot=(0, 0, 45))
    box(name + "_p2", (5.5, 5.5, 0.9), (0, 0, 27.2), Mi, 0.08, parent=r, coll=coll)
    cyl(name + "_top", 2.0, 18, (0, 0, 36.5), Mi, 4, parent=r, coll=coll, r2=0.3, rot=(0, 0, 45))
    cyl(name + "_spire", 0.18, 4, (0, 0, 47), Mi, 8, parent=r, coll=coll)
    return r


def paris():
    c = collection("PARIS")
    W.sky(1.0)
    W.sun(4.0, rot=(48, 0, 20))
    box("pa_ground", (400, 400, 0.4), (0, 0, -0.2), M("paris_stone", "#c9c1b2", 0.8), 0, coll=c)
    box("pa_walk", (60, 8, 0.1), (0, 3, 0.05), checker_mat("pa_tiles", "#d8d0c0", "#c4bba8", 0.4), 0, coll=c)
    eiffel("pa_eiffel", (6, 70, 0), 1.25, coll=c)
    rnd = random.Random(5)
    for i in range(10):
        x = -48 + i * 10.5
        if -8 < x < 20:
            continue
        h = rnd.uniform(12, 16)
        box(f"pa_bld{i}", (10, 8, h), (x, 22, h / 2), M("pa_cream", "#efe2c6", 0.7), 0.1, coll=c)
        box(f"pa_roof{i}", (10.4, 8.4, 2.4), (x, 22, h + 1.2), M("pa_roof", "#5a6a7a", 0.6), 0.6, coll=c)
        for q in range(3):
            for z in (4, 8):
                box(f"pa_w{i}{q}{z}", (1.6, 0.2, 2.2), (x - 3 + q * 3, 17.95, z), M("pa_win", "#33435a", 0.2), 0.03, coll=c)
    for k, x in enumerate((-9, 9)):
        cyl(f"pa_lamp{k}", 0.15, 7, (x, 0, 3.5), M("lamp_black", "#1a1a1e", 0.4), 8, coll=c)
        sphere(f"pa_lampg{k}", 0.5, (x, 0, 7.2), mat("lamp_glow", hexc("#ffe9b0"), 0.3, emit=hexc("#ffe9b0"), estr=3), coll=c)
    light("pa_fill", "AREA", (0, -12, 9), 2500, (1.0, 0.97, 0.92), 12, coll=c, target=(0, 3, 3))
    return c


def italy():
    c = collection("ITALY")
    W.sky(1.0, top=(0.08, 0.3, 0.85), bottom=(0.95, 0.8, 0.6))
    W.sun(4.5, rot=(45, 0, -30))
    box("it_ground", (400, 400, 0.4), (0, 0, -0.2), checker_mat("it_tiles", "#d89a6a", "#c88a5a", 0.25), 0, coll=c)
    Mt = M("pisa_white", "#f4efe2", 0.6)
    tw = empty("it_tower", (14, 48, 0), coll=c, rot=(0, -6, 0))
    cyl("it_tower_body", 4.0, 34, (0, 0, 17), Mt, 32, parent=tw, coll=c)
    for k in range(8):
        cyl(f"it_band{k}", 4.4, 0.6, (0, 0, 3 + k * 4.2), M("pisa_band", "#e4dccb", 0.6), 32, parent=tw, coll=c)
    cyl("it_tower_top", 3.0, 3, (0, 0, 35.5), Mt, 32, parent=tw, coll=c)
    rnd = random.Random(8)
    for i in range(9):
        x = -50 + i * 11
        if 4 < x < 24:
            continue
        h = rnd.uniform(9, 13)
        col = rnd.choice(["#e8a060", "#f2c890", "#d97a4a", "#f0d8a8"])
        box(f"it_bld{i}", (10, 8, h), (x, 26, h / 2), M("it_b" + col, col, 0.8), 0.1, coll=c)
        box(f"it_roof{i}", (10.6, 8.6, 1.0), (x, 26, h + 0.5), M("terracotta", "#b04a2a", 0.7), 0.2, coll=c)
    light("it_fill", "AREA", (0, -12, 9), 2500, (1.0, 0.95, 0.88), 12, coll=c, target=(0, 3, 3))
    return c


def living():
    world((0.85, 0.9, 1.0), 0.5)
    return W.tv_room()


def couch(name, loc, coll=None):
    r = empty(name, loc, coll=coll)
    Mc = M("couch", "#4fb3b8", 0.6)
    box(name + "_seat", (8, 4, 1.6), (0, 0, 1.4), Mc, 0.4, parent=r, coll=coll)
    box(name + "_back", (8, 1.4, 4.0), (0, 2.1, 2.6), Mc, 0.5, parent=r, coll=coll)
    for sx in (-1, 1):
        box(f"{name}_arm{sx}", (1.4, 4.5, 2.8), (sx * 4.4, 0.1, 1.8), Mc, 0.5, parent=r, coll=coll)
    return r


def sam_room(night=False):
    c = collection("ROOM")
    world((0.2, 0.25, 0.5) if night else (0.85, 0.9, 1.0), 0.25 if night else 0.5)
    box("rm_floor", (40, 40, 0.4), (0, 0, -0.2), planks("rm_floor", "#c9a27a", "#bd966e", "#7a5a40"), 0, coll=c)
    Mw = M("rm_wall", "#9fb3d8" if night else "#c4d0e8", 0.85)
    box("rm_back", (40, 0.5, 14), (0, 10.25, 7), Mw, 0, coll=c)
    box("rm_left", (0.5, 40, 14), (-12.25, 0, 7), Mw, 0, coll=c)
    wincol = (0.08, 0.12, 0.3) if night else (0.75, 0.88, 1.0)
    card("rm_win", 5.0, 5.0, (3.0, 9.98, 7.5), mat("rm_window", wincol, 0.2, emit=wincol, estr=2.5 if not night else 1.5), "-Y", coll=c)
    frame_m = M("rm_frame", "#f4f4f4", 0.4)
    for dz in (-2.6, 2.6):
        box(f"rm_wf{dz}", (5.6, 0.3, 0.35), (3.0, 9.9, 7.5 + dz), frame_m, 0.03, coll=c)
    for dx in (-2.6, 0, 2.6):
        box(f"rm_wv{dx}", (0.35, 0.3, 5.6), (3.0 + dx, 9.9, 7.5), frame_m, 0.03, coll=c)
    if night:
        sphere("rm_moon", 0.7, (4.2, 10.0, 8.7), mat("moon_glow", hexc("#f4f0d8"), 0.5, emit=hexc("#f4f0d8"), estr=5), coll=c)
    box("rm_bed", (6, 9, 1.6), (-8.5, 5, 1.2), M("bed_frame", "#f3f3f1", 0.45), 0.1, coll=c)
    box("rm_blanket", (6.2, 6, 0.5), (-8.5, 3.6, 2.2), checker_mat("blanket", "#d9453a", "#f2c14e", 1.4), 0.2, coll=c)
    box("rm_pillow", (4.4, 1.8, 0.8), (-8.5, 8.4, 2.4), M("pillow", "#f7f8fb", 0.7), 0.3, coll=c)
    box("rm_stand", (2.4, 2.2, 2.9), (-4.0, 8.6, 1.45), wood("wood_dark", "#6e4229", "#a06a45", 2.5), 0.06, coll=c)
    pill_bottle("rm_pills", (-4.0, 8.4, 2.9), 0.6, coll=c)
    box("rm_tissue", (1.0, 0.7, 0.6), (-3.3, 8.4, 3.2), M("tissue_box", "#6fb3e0", 0.5), 0.05, coll=c)
    card("rm_poster", 3.2, 4.2, (-12.0, 2.0, 8.0), M("poster_c", "#f2c14e", 0.6), "+X", coll=c)
    label("rm_postert", "ACHOO!", (-11.9, 2.0, 8.0), 0.8, "#d9453a", rot=(90, 0, 90), extrude=0.02)
    if night:
        light("rm_moonl", "AREA", (3, 12, 9), 1800, (0.5, 0.62, 1.0), 6, coll=c, target=(0, 0, 3))
        light("rm_fill", "AREA", (4, -12, 8), 900, (0.55, 0.62, 1.0), 10, coll=c, target=(0, 2, 3))
        light("rm_lamp", "POINT", (-4.0, 7.6, 5.0), 150, (1.0, 0.7, 0.4), 1.0, coll=c)
    else:
        light("rm_key", "AREA", (-2, -8, 12), 7000, (1.0, 0.98, 0.95), 10, coll=c, target=(0, 2, 0))
        light("rm_winl", "AREA", (3, 12, 8), 3000, (1.0, 0.93, 0.82), 6, coll=c, target=(0, 0, 2))
    return c


def kitchen(night=False, chairs=None):
    c = collection("KITCHEN")
    world((0.15, 0.18, 0.35) if night else (0.9, 0.9, 0.95), 0.25 if night else 0.55)
    box("kt_floor", (40, 40, 0.4), (0, 0, -0.2), checker_mat("kt_floor", "#f2efe6", "#c8d4e0", 0.3), 0, coll=c)
    Mw = M("kt_wall", "#f2e0b0" if not night else "#a8a0a0", 0.85)
    box("kt_back", (40, 0.5, 14), (0, 10.25, 7), Mw, 0, coll=c)
    box("kt_left", (0.5, 40, 14), (-14.25, 0, 7), Mw, 0, coll=c)
    Mcab = M("kt_cab", "#4f8fc0", 0.5)
    Mtop = M("kt_top", "#f4f4f4", 0.3)
    box("kt_counter", (20, 2.6, 3.4), (-3, 8.7, 1.7), Mcab, 0.05, coll=c)
    box("kt_ctop", (20.4, 2.9, 0.3), (-3, 8.6, 3.55), Mtop, 0.04, coll=c)
    box("kt_upper", (14, 1.6, 3.4), (-6, 9.2, 9.6), Mcab, 0.05, coll=c)
    for i in range(6):
        box(f"kt_h{i}", (0.9, 0.12, 0.15), (-11 + i * 3.3, 7.35, 3.0), M("kt_handle", "#d0d4da", 0.2, metal=1), 0.02, coll=c)
    box("kt_fridge", (4.2, 3, 10), (10.5, 8.4, 5), M("fridge", "#e8ecf0", 0.25), 0.2, coll=c)
    wincol = (0.08, 0.12, 0.3) if night else (0.75, 0.88, 1.0)
    card("kt_win", 5.0, 3.6, (4.0, 9.98, 7.4), mat("kt_window", wincol, 0.2, emit=wincol, estr=2.0), "-Y", coll=c)
    # table + chairs
    Mt = wood("kt_table", "#a0703f", "#c89260", 2.0)
    box("kt_tabletop", (8, 5, 0.35), (0, 0, 3.4), Mt, 0.06, coll=c)
    for sx in (-1, 1):
        for sy in (-1, 1):
            box(f"kt_tleg{sx}{sy}", (0.35, 0.35, 3.3), (sx * 3.5, sy * 2.0, 1.65), Mt, 0.03, coll=c)
    for k, (x, y) in enumerate(((-5.5, 0), (5.5, 0)) if (chairs if chairs is not None else not night) else ()):
        box(f"kt_chair{k}", (2.2, 2.2, 0.3), (x, y, 2.2), Mt, 0.05, coll=c)
        box(f"kt_chairb{k}", (0.3, 2.2, 3.0), (x + (-1.0 if x < 0 else 1.0), y, 3.7), Mt, 0.05, coll=c)
    cyl("kt_lamp", 1.1, 0.8, (0, 0, 11.2), M("lamp_red", "#d9453a", 0.4), 24, coll=c, r2=0.4)
    if night:
        light("kt_moon", "AREA", (4, 12, 8), 1200, (0.5, 0.62, 1.0), 6, coll=c, target=(0, 2, 2))
        light("kt_fill", "AREA", (-2, -10, 8), 1600, (0.6, 0.66, 1.0), 10, coll=c, target=(-5, 4, 3))
        light("kt_under", "AREA", (-6, 8.0, 8.0), 500, (1.0, 0.8, 0.5), 6, coll=c, target=(-6, 4, 2))
    else:
        light("kt_key", "POINT", (0, 0, 10.4), 2200, (1.0, 0.85, 0.65), 1.5, coll=c)
        light("kt_fill", "AREA", (0, -12, 10), 4500, (1.0, 0.97, 0.92), 12, coll=c, target=(0, 3, 2))
    return c


DRAWER = (-6.0, 7.35, 2.2)


def pepper_drawer(t_open, glow=True):
    """Drawer in the counter (front at y=7.35) that slides out at t_open; returns drawer root."""
    dr = empty("pd_root", DRAWER)
    Md = M("pd_front", "#3a6a9a", 0.5)
    box("pd_front", (3.0, 0.25, 1.4), (0, 0, 0), Md, 0.05, parent=dr)
    box("pd_box", (2.8, 2.2, 1.0), (0, 1.1, 0.0), M("pd_in", "#6e4229", 0.8), 0.02, parent=dr)
    label("pd_label", "SECRET", (0, -0.16, 0.05), 0.42, "#ffe070", extrude=0.02, parent=dr)
    gr = grinder("pd_grinder", (0, 1.1, -0.2), 0.75, parent=dr)
    for i in range(5):
        pepper_shaker_s = W2.pepper_shaker(f"pd_shk{i}", (-1.0 + i * 0.5, 1.6, -0.3), s=0.35)
        pepper_shaker_s.parent = dr
        pepper_shaker_s.location = (-1.0 + i * 0.5, 1.6, -0.3)
    keyloc(dr, t_open - 0.02, DRAWER)
    keyloc(dr, t_open + 0.25, (DRAWER[0], DRAWER[1] - 2.2, DRAWER[2]))
    if glow:
        lt = light("pd_glow", "POINT", (DRAWER[0], DRAWER[1] - 1.6, DRAWER[2] + 1.2), 0, (1.0, 0.8, 0.3), 0.6)
        lt.data.keyframe_insert("energy", frame=F(t_open))
        lt.data.energy = 600
        lt.data.keyframe_insert("energy", frame=F(t_open + 0.2))
    return dr, gr


def street_kids_sneeze(ch, t0, tc, p):
    W2.sneeze(ch, t0, tc)
    sfx(tc, "sneeze", 0.9)


# ================================================================== HOOK (0-6s)
@S(1, 0, 4, "HOOK: Sam's monster sneeze on the street -> POOF on 'teleports'")
def s01(t0, t1):
    town_day()
    E = sam(t0, t1, "neutral")
    p = (0, -30, 0)
    E.pose(t0, loc=p, rot=0)
    red_nose(E)
    tc = w(1) + 0.1
    W2.sneeze(E, t0, tc)
    tv = w(2) + 0.05
    W2.vanish(E, tv)
    W2.poof("poof", up(p, 4.2), tv, 0.9)
    flash(tv, 1.6)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.5), 6.5, 4.6, yaw=12, pitch=4, lens=26, yaw1=-4)
    cam.crash(tc, 26, 38, 0.08)
    cam.crash(tv, 38, 24, 0.12)
    cam.handheld(1.6)
    sfx(tc, "sneeze")
    sfx(tv, "poof")


@S(2, 4, 9, "Last week I sneezed once: Sam in his room, crash zoom on the sneeze")
def s02(t0, t1):
    sam_room(False)
    E = sam(t0, t1, "worried")
    p = (0, 2, 0)
    E.pose(t0, loc=p, rot=-10)
    tc = w(7) + 0.12
    W2.sneeze(E, t0 + 0.05, tc)
    cam = Cam()
    cam.whip(t0, t0 + 0.14, (8, -10, 5), (6, 6, 4), orbit_pos(up(p, 4.5), 7, -15, 4), up(p, 4.5), lens=26)
    cam.key(t1, orbit_pos(up(p, 4.0), 7.0, -5, 4), up(p, 4.0), lens=28)
    cam.crash(tc, 30, 40, 0.08)
    cam.handheld(1.4)
    sfx(tc, "sneeze")


@S(3, 9, 18, "POOF into a dark frozen forest: Sam lands in the snow")
def s03(t0, t1):
    snow_forest(seed=4)
    E = sam(t0, t1, "gasp")
    p = (0, 0, 0)
    E.pose(t0, loc=p, rot=0)
    ta = t0 + 0.1
    W2.appear(E, ta, t0)
    W2.poof("poof", up(p, 4.0), ta, 0.9)
    flash(ta, 1.4)
    E.act(ta + 0.1, "shock", expr="shock")
    E.face(w(15), "terror")
    E.act(w(15), "hands_head", 0.9)
    look_at(E, w(13), (-8, 10, 6))
    look_at(E, w(15) + 0.1, (8, 10, 6))
    snowfall("snow", (0, 0, 0), (30, 30, 14), t0, t1, n=240, wind=2.0)
    night_rig(up(p, 4))
    cam = Cam()
    cam.orbit(t0, t1, up(p, 3.8), 11.0, -25, 25, pitch=10, lens=22, fstop=5)
    cam.handheld(1.0)
    sfx(ta, "poof")
    sfx(t0 + 0.2, "wind", 0.6, dur=t1 - t0)


@S(4, 18, 20, "FROZEN FOREST: crane up over the endless snowy pines")
def s04(t0, t1):
    snow_forest(seed=4)
    E = sam(t0, t1, "terror")
    E.pose(t0, loc=(0, 0, 0), rot=0)
    E.act(t0, "hands_head", 0.9)
    snowfall("snow", (0, -4, 0), (40, 40, 22), t0, t1, n=260, wind=3.0)
    night_rig((0, 0, 4))
    cam = Cam()
    cam.key(t0, (6, -16, 10), (0, 2, 3), lens=20, focus=17.0, fstop=8)
    cam.key(t1, (10, -30, 26), (0, 6, 2), lens=18, focus=36.0, fstop=8)
    cam.handheld(0.8)
    sfx(t0, "whoosh", 0.7)


@S(5, 20, 23, "...holding a cat: crash in on the grey stray in his arms")
def s05(t0, t1):
    snow_forest(seed=4)
    E = sam(t0, t1, "gasp")
    p = (0, 0, 0)
    E.pose(t0, loc=p, rot=0)
    hold_cat(E)
    E.act(t0, "hold", 1.0)
    E.face(w(22), eyes="side_r", mouth="grimace")
    snowfall("snow", (0, -2, 0), (20, 20, 12), t0, t1, n=160)
    night_rig(up(p, 3.5))
    cam = Cam()
    cam.push(t0, t1, up(p, 3.6), 7.5, 5.2, yaw=8, pitch=8, lens=26)
    cam.crash(w(22) - 0.05, 26, 36, 0.1)
    cam.handheld(1.2)
    sfx(w(22) - 0.05, "meow")


@S(6, 23, 26, "Let me explain: Sam shrugs to camera, freeze-orbit")
def s06(t0, t1):
    snow_forest(seed=4)
    E = sam(t0, t1, "smug")
    p = (0, 0, 0)
    E.pose(t0, loc=p, rot=0)
    hold_cat(E)
    E.act(t0, "hold", 1.0)
    E.face(t0 + 0.1, "smug")
    snowfall("snow", (0, -2, 0), (20, 20, 12), t0, t1, n=140, speed=0.6, wind=0.2)
    night_rig(up(p, 3.5))
    cam = Cam()
    cam.orbit(t0, t1, up(p, 4.2), 5.5, -30, 20, pitch=2, lens=30, fstop=3)
    cam.handheld(0.5)
    sfx(t0, "u_notif", 0.8)


# ================================================================== RULE (6-17s)
@S(7, 26, 33, "In this world, every time you sneeze: a kid on the street, donut thought, CHOO")
def s07(t0, t1):
    town_day()
    k = townie(3, t0, t1, "happy")
    p = (4, -30, 0)
    k.pose(t0, loc=p, rot=-8)
    k.act(t0, "think", 0.8)
    cont = bubble("thought", up(p, 9.2), t0 + 0.15, None, 1.0, tail_to=up(p, 5.6))
    donut("th_donut", (0, -0.4, 0), 0.75, parent=cont)
    tc = w(32) + 0.08
    W2.sneeze(k, w(31), tc)
    cam = Cam()
    cam.push(t0, t1, up(p, 6.2), 13.0, 9.5, yaw=-10, pitch=6, lens=26, yaw1=4)
    cam.crash(tc, 26, 34, 0.08)
    cam.handheld(1.0)
    sfx(tc, "sneeze", 0.9)


@S(8, 33, 36, "...you teleport: POOF, he is gone, bubble pops")
def s08(t0, t1):
    town_day()
    k = townie(3, t0, t1, "gasp")
    p = (4, -30, 0)
    k.pose(t0, loc=p, rot=-8)
    tv = t0 + 0.05
    W2.vanish(k, tv)
    W2.poof("poof", up(p, 4.0), tv, 1.0)
    flash(tv, 1.3)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.0), 8.0, 11.0, yaw=-4, pitch=6, lens=24)
    cam.handheld(1.4)
    sfx(tv, "poof")


@S(9, 36, 41, "...to whatever you were thinking about: he pops up in a donut shop")
def s09(t0, t1):
    shop("donuts")
    donut("big_donut", (3.0, 3.2, 5.6), 1.4)
    k = townie(3, t0, t1, "gasp")
    p = (-1.5, -1.0, 0)
    k.pose(t0, loc=p, rot=-10)
    ta = t0 + 0.08
    W2.appear(k, ta, t0)
    W2.poof("poof", up(p, 4.0), ta, 0.8)
    k.face(w(39), "joy")
    k.act(w(39), "cheer", 0.9)
    W_ = worker(t0, t1, 0, "shock", shirt="#f59bc8")
    W_.pose(t0, loc=(2.5, 5.6, 0), rot=180)
    cam = Cam()
    cam.whip(t0, t0 + 0.1, (12, -14, 6), (6, 4, 4), (0.5, -11, 5.2), (0.6, 2, 4.2), lens=22)
    cam.key(t1, (0.2, -8.5, 5.0), (0.4, 2, 4.4), lens=24)
    cam.handheld(1.0)
    sfx(ta, "poof")
    sfx(w(39), "u_squeak", 0.8)


@S(10, 41, 47, "Whatever you're holding comes with you: kid + dog vanish together")
def s10(t0, t1):
    town_day()
    k = townie(5, t0, t1, "neutral")
    p = (-4, -30, 0)
    k.pose(t0, loc=p, rot=15)
    k.act(t0, "hold", 0.6)
    d = W.dog("dog", (-1.5, -31.5, 0))
    leash = cyl("leash", 0.04, 3.0, (-2.7, -31.0, 2.0), M("leash", "#d9453a", 0.4), 6, rot=(0, 60, 30))
    tc = w(43)
    W2.sneeze(k, t0 + 0.1, tc)
    tv = w(44) + 0.05
    W2.vanish(k, tv)
    hide_tree(d, tv)
    sets.set_obj_visible(leash, tv - 1 / 30, True)
    sets.set_obj_visible(leash, tv, False)
    W2.poof("poof", (-3, -30.6, 3.0), tv, 1.4)
    cam = Cam()
    cam.push(t0, t1, (-3, -30.5, 3.2), 13.0, 10.0, yaw=20, pitch=8, lens=24, yaw1=8)
    cam.crash(tc, 24, 30, 0.08)
    cam.handheld(1.0)
    sfx(tc, "sneeze", 0.8)
    sfx(tv, "poof")
    sfx(tv + 0.2, "boing", 0.5)


@S(11, 47, 55, "Pepper sold only with a prescription: pharmacy, grinder behind glass")
def s11(t0, t1):
    shop("pharmacy")
    grinder("ph_grinder", (0, 3.2, 3.9), 1.0)
    label("ph_rx", "Rx ONLY", (0, 2.4, 7.0), 0.7, "#d9453a", extrude=0.03)
    ph = worker(t0, t1, 1, "bored", shirt="#ffffff")
    ph.pose(t0, loc=(3.4, 5.6, 0), rot=180)
    ph.act(t0, "cross", 0.9)
    paper = card("ph_paper", 1.2, 1.6, (-2.4, 1.6, 4.4), M("rx_paper", "#fbfbf6", 0.6), "-Y")
    pop_in(paper, w(53), 1.0)
    label("ph_paper_t", "Rx", (-2.4, 1.55, 4.6), 0.5, "#2a5ad0", extrude=0.01)
    cam = Cam()
    cam.push(t0, t1, (0, 3.2, 5.4), 12.0, 8.0, yaw=8, pitch=6, lens=26, yaw1=-6)
    cam.crash(w(48), 26, 32, 0.1)
    cam.handheld(0.8)
    sfx(w(48), "ding", 0.6)
    sfx(w(54), "u_pay", 0.9)


@S(12, 55, 60, "In spring, airports are empty: huge empty terminal, CANCELLED board")
def s12(t0, t1):
    airport()
    j = townie(6, t0, t1, "bored")
    j.pose(t0, loc=(6, 6, 0), rot=-30)
    mop = cyl("mop", 0.08, 5.0, (0, -0.8, -1.0), M("mop", "#c89260", 0.6), 8, parent=j.shR, rot=(20, 0, 0))
    W.pigeon("pig", (-3, 0, 0))
    cam = Cam()
    cam.key(t0, (-14, -16, 12), (-4, 14, 6), lens=18, focus=26.0, fstop=8)
    cam.key(t1, (-8, -12, 9), (-5, 16, 9), lens=20, focus=26.0, fstop=8)
    cam.handheld(0.7)
    sfx(t0 + 0.1, "crickets", 0.8, dur=t1 - t0)


@S(13, 60, 66, "because why fly when you can just: kid with suitcase walks into a flower shop")
def s13(t0, t1):
    world((0.9, 0.85, 0.9), 0.5)
    W2.flower_shop()
    k = townie(1, t0, t1, "smug")
    p0, p1 = (-7, -1.0, 0), (-1.5, 1.2, 0)
    k.walk(t0, w(64), p0, p1, rate=2.6)
    k.pose(w(64) + 0.1, rot=0)
    sc = box("suitcase", (1.4, 0.6, 1.8), (0, -0.5, -2.6), M("suitcase", "#d9453a", 0.4), 0.12, parent=k.shR)
    k.face(w(64), "smug")
    cam = Cam()
    cam.push(t0, t1, (-3.5, 0.5, 4.2), 12.0, 9.0, yaw=-30, pitch=6, lens=24, yaw1=-12)
    cam.handheld(0.8)
    sfx(t0, "footsteps", 0.5, dur=w(64) - t0)


@S(14, 66, 70, "sniff a flower? -> CHOO, POOF, suitcase and all")
def s14(t0, t1):
    world((0.9, 0.85, 0.9), 0.5)
    W2.flower_shop()
    k = townie(1, t0, t1, "smile")
    p = (-1.5, 1.6, 0)
    k.pose(t0, loc=p, rot=0)
    k.pose(t0, armR=(125, -30), head=(0, 12, 0))
    cyl("hfl_stem", 0.05, 1.6, (0, 0, -2.2), M("leaf", "#5fae4a", 0.5), 6, parent=k.shR)
    sphere("hfl_bloom", 0.42, (0, 0, -3.0), M("fl#f09ac2", "#f09ac2", 0.5), (1, 1, 0.7), parent=k.shR, seg=12)
    k.face(t0, eyes="closed", mouth="smile")
    tc = w(69) + 0.1
    W2.sneeze(k, w(68), tc)
    tv = tc + 0.22
    W2.vanish(k, tv)
    W2.poof("poof", up(p, 4.0), tv, 0.9)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.6), 6.0, 4.2, yaw=-4, pitch=2, lens=30)
    cam.crash(tc, 30, 40, 0.08)
    cam.handheld(1.4)
    sfx(tc, "sneeze", 0.9)
    sfx(tv, "poof")


@S(15, 70, 74, "Bless you means goodbye: friend waves sadly at the poof")
def s15(t0, t1):
    town_day()
    a = townie(2, t0, t1, "neutral")
    b = townie(7, t0, t1, "sad" if False else "worried")
    pa, pb = (-2.5, -30, 0), (2.5, -30, 0)
    a.pose(t0, loc=pa, rot=facing(pa, pb))
    b.pose(t0, loc=pb, rot=facing(pb, pa))
    tv = t0 + 0.12
    W2.vanish(a, tv)
    W2.poof("poof", up(pa, 4.0), tv, 0.9)
    b.act(w(71), "wave", 1.0, expr="cry")
    from rbx import acting
    acting.wiggle(b, w(71) + 0.1, t1, "armR", (20, 10), 5.0, (165, 25))
    tears(b, w(72), t1, n=6)
    cam = Cam()
    cam.push(t0, t1, up(pb, 4.4), 8.0, 5.5, yaw=-30, pitch=3, lens=26)
    cam.handheld(0.9)
    sfx(tv, "poof")
    sfx(w(72), "aww", 0.7)


# ================================================================== SOCIETY EXAMPLES (17-30s)
@S(16, 74, 81, "My grandma sneezed while holding her couch")
def s16(t0, t1):
    living()
    G = granny(t0, t1, "smile")
    p = (0, 6.0, 0.25)
    G.pose(t0, loc=p, rot=0, legL=(85, 3), legR=(85, -3), armL=(40, 40), armR=(40, 40))
    G.face(w(78), eyes="angry", mouth="grimace")
    G.pose(w(78), armL=(30, 75), armR=(30, 75))
    tc = w(77) + 0.12
    W2.sneeze(G, w(76), tc)
    cam = Cam()
    cam.push(t0, t1, (0, 6.0, 4.0), 10.0, 7.5, yaw=-8, pitch=6, lens=24, yaw1=6)
    cam.crash(tc, 24, 30, 0.08)
    cam.handheld(0.9)
    sfx(tc, "sneeze", 0.9)
    sfx(w(80), "u_squeak", 0.5)


@S(17, 81, 86, "She landed in Paris: couch POOFs onto a street, Eiffel tower behind")
def s17(t0, t1):
    paris()
    cc = couch("pcouch", (0, 0, 0))
    G = granny(t0, t1, "shock")
    G.root.parent = cc
    G.pose(t0, loc=(0, 0.2, 0.25), rot=0, legL=(85, 3), legR=(85, -3), armL=(30, 40), armR=(30, 40))
    ta = w(83)
    hide_tree(cc, ta, True, t0)
    keyloc(cc, ta, (0, 0, 2.5))
    keyloc(cc, ta + 0.18, (0, 0, 0))
    W2.poof("poof", (0, 0, 3), ta, 2.0)
    flash(ta, 1.2)
    G.face(ta + 0.3, "gasp")
    look_at(G, ta + 0.5, (6, 70, 30))
    cam = Cam()
    cam.key(t0, (6, -16, 3), (2, 20, 14), lens=20, focus=17.0, fstop=8)
    cam.key(t1, (3, -13, 2.4), (2, 20, 16), lens=20, focus=14.0, fstop=8)
    cam.crash(ta + 0.15, 20, 24, 0.1)
    cam.handheld(1.0)
    sfx(ta, "poof")
    sfx(ta + 0.18, "thud", 0.8)


@S(18, 86, 90, "...still sitting on it: grandma sips tea, totally calm")
def s18(t0, t1):
    paris()
    cc = couch("pcouch", (0, 0, 0))
    G = granny(t0, t1, "smug")
    G.root.parent = cc
    G.pose(t0, loc=(0, 0.2, 0.25), rot=0, legL=(85, 3), legR=(85, -3), armL=(40, 40))
    G.pose(t0, armR=(110, -20))
    cup = cyl("cup", 0.35, 0.7, (0, -0.3, -2.0), M("cup", "#f4f4f4", 0.3), 16, parent=G.shR)
    G.pose(w(88), head=(0, -10, 0))
    G.face(w(88), eyes="closed", mouth="smile")
    cam = Cam()
    cam.push(t0, t1, (0, 0.2, 4.6), 7.0, 5.0, yaw=24, pitch=3, lens=30, yaw1=10)
    cam.handheld(0.6)
    sfx(w(87), "u_quack", 0.8)


@S(19, 90, 97, "My dad sneezed thinking about a sandwich: in bed, sandwich thought bubble")
def s19(t0, t1):
    sam_room(True)
    D_ = papa(t0, t1, "smile")
    p = (-8.5, 3.2, 2.4)
    D_.pose(t0, loc=p, rot=0)
    D_.root.rotation_euler[0] = math.radians(-80)
    D_.root.keyframe_insert("rotation_euler", index=0, frame=F(t0))
    D_.face(t0, eyes="closed", mouth="smile")
    cont = bubble("thought", (-8.5, 4.0, 9.0), w(94), None, 1.1, tail_to=(-8.5, 6.5, 5))
    sandwich("th_sand", (0, -0.5, -0.8), 0.7, parent=cont)
    tc = w(92) + 0.1
    D_.face(tc, eyes="closed", mouth="scream")
    D_.pose(tc - 0.1, head=(0, -20, 0))
    D_.pose(tc + 0.06, head=(0, 25, 0))
    D_.pose(tc + 0.3, head=(0, 0, 0))
    D_.face(tc + 0.3, eyes="closed", mouth="smile")
    cam = Cam()
    cam.push(t0, t1, (-8.5, 4.5, 5.0), 11.0, 8.0, yaw=-30, pitch=24, lens=24, yaw1=-14)
    cam.crash(tc, 24, 30, 0.08)
    cam.handheld(0.8)
    sfx(tc, "sneeze", 0.8)


@S(20, 97, 106, "He woke up inside a sandwich shop in Ohio: POOF on the counter")
def s20(t0, t1):
    shop("subs")
    sandwich("big_sand", (4.6, 3.2, 3.9), 1.1)
    D_ = papa(t0, t1, "smile")
    p = (-0.5, 3.4, 4.5)
    D_.pose(t0, loc=p, rot=90)
    D_.root.rotation_euler[0] = math.radians(-80)
    D_.root.keyframe_insert("rotation_euler", index=0, frame=F(t0))
    D_.face(t0, eyes="closed", mouth="smile")
    ta = w(97) + 0.1
    W2.appear(D_, ta, t0)
    W2.poof("poof", up(p, 1.0), ta, 1.0)
    D_.face(w(98), eyes="wide", mouth="o")
    Wk = worker(t0, t1, 0, "shock")
    Wk.pose(t0, loc=(2.0, 6.2, 0), rot=180)
    Wk.act(ta + 0.25, "recoil", 1.0, expr="shock")
    cam = Cam()
    cam.key(t0, (-7, -7, 10), (-2.5, 3.4, 4.8), lens=22, focus=12.0, fstop=6)
    cam.key(t1, (-5, -4.5, 9), (-2.5, 3.6, 5.0), lens=24, focus=9.0, fstop=6)
    cam.crash(w(103), 22, 28, 0.1)
    cam.handheld(1.0)
    sfx(ta, "poof")
    sfx(w(103), "ding", 0.6)


@S(21, 106, 108, "...wearing pajamas: dad sits up, striped PJs, FAAA")
def s21(t0, t1):
    shop("subs")
    D_ = papa(t0, t1, "shock")
    p = (-1.5, 2.6, 1.95)
    D_.pose(t0, loc=p, rot=0, legL=(85, 3), legR=(85, -3))
    D_.act(t0 + 0.05, "hands_face", 1.0, expr="terror")
    cam = Cam()
    cam.push(t0, t1, up(p, 3.8), 10.0, 8.0, yaw=-12, pitch=4, lens=24)
    cam.crash(t0 + 0.03, 22, 30, 0.1)
    cam.handheld(1.6)
    sfx(t0 + 0.03, "u_faaaa", 0.8)


@S(22, 108, 113, "And at my uncle's wedding: arch, guests, bride and groom")
def s22(t0, t1):
    wedding()
    W2.seated_audience(t0, t1, rows=3, cols=6, origin=(0, -2.0), mode="stare", seed=4)
    G = groom(t0, t1, "happy")
    B = bride(t0, t1, "happy")
    G.pose(t0, loc=(-1.8, 8.0, 0), rot=facing((-1.8, 8), (1.8, 8)))
    B.pose(t0, loc=(1.8, 8.0, 0), rot=facing((1.8, 8), (-1.8, 8)))
    confetti("cf", (0, 6, 9), (8, 4, 2), t0, dur=t1 - t0, n=40, fall=6)
    cam = Cam()
    cam.key(t0, (-4, -16, 11), (0, 8, 4), lens=22, focus=24.0, fstop=8)
    cam.key(t1, (2, -12, 8), (0, 8, 4.4), lens=22, focus=20.0, fstop=8)
    cam.handheld(0.7)
    sfx(t0, "u_correct", 0.35)


@S(23, 113, 119, "the groom sneezed during the vows")
def s23(t0, t1):
    wedding()
    G = groom(t0, t1, "happy")
    B = bride(t0, t1, "happy")
    pg, pb = (-1.8, 8.0, 0), (1.8, 8.0, 0)
    G.pose(t0, loc=pg, rot=facing(pg, pb))
    B.pose(t0, loc=pb, rot=facing(pb, pg))
    lips(G, t0, w(115) - 0.2)
    tc = w(115) + 0.12
    W2.sneeze(G, w(114), tc)
    B.face(tc + 0.15, "shock")
    B.act(tc + 0.15, "recoil", 0.7)
    cam = Cam()
    cam.push(t0, t1, up(pg, 4.5), 6.5, 4.6, yaw=55, pitch=3, lens=28, yaw1=35)
    cam.crash(tc, 28, 38, 0.08)
    cam.handheld(1.2)
    sfx(tc, "sneeze", 0.9)


@S(24, 119, 124, "while thinking about his ex: bubble shows another girl, groom POOFs")
def s24(t0, t1):
    wedding()
    G = groom(t0, t1, "smug")
    B = bride(t0, t1, "shock")
    pg, pb = (-1.8, 8.0, 0), (1.8, 8.0, 0)
    G.pose(t0, loc=pg, rot=facing(pg, pb))
    B.pose(t0, loc=pb, rot=facing(pb, pg))
    G.face(t0, "smug")
    cont = bubble("thought", (-4.5, 7.0, 9.6), w(121), w(123), 1.0, tail_to=up(pg, 5.6))
    ex = chars.Char("Ex", skin="#d9b48f", shirt="#c8261e", pants="#22232a", hair="bob", hair_color="#e0c060",
                    face="girl", sleeves="long", scale=0.42)
    ex.face(t0, "wink")
    ex.root.parent = cont
    ex.root.location = (0, -0.2, -1.9)
    tv = w(123) + 0.05
    W2.vanish(G, tv)
    W2.poof("poof", up(pg, 4.0), tv, 0.9)
    B.face(tv + 0.15, "furious")
    cam = Cam()
    cam.push(t0, t1, (-3.4, 8.0, 7.6), 13.0, 11.0, yaw=25, pitch=6, lens=24, yaw1=12)
    cam.handheld(0.9)
    sfx(w(121), "sparkle", 0.7)
    sfx(tv, "poof")


@S(25, 124, 128, "There was no wedding: bride alone, furious, slow push. BRUH")
def s25(t0, t1):
    wedding()
    W2.seated_audience(t0, t1, rows=3, cols=6, origin=(0, -2.0), mode="stare", seed=5)
    B = bride(t0, t1, "furious")
    pb = (1.8, 8.0, 0)
    B.pose(t0, loc=pb, rot=-10)
    B.act(t0, "cross", 1.0)
    B.face(w(126), eyes="angry", mouth="frown")
    cam = Cam()
    cam.push(t0, t1, up(pb, 4.6), 9.0, 5.5, yaw=-6, pitch=2, lens=28)
    cam.handheld(0.5)
    sfx(w(126), "u_bruh", 1.0)


# ================================================================== SAM (30-40s)
@S(26, 128, 130, "I'm Sam: whip to Sam in his room, waves, name pops")
def s26(t0, t1):
    sam_room(False)
    E = sam(t0, t1, "happy")
    p = (0, 2, 0)
    E.pose(t0, loc=p, rot=0)
    E.act(t0 + 0.05, "wave", 1.0)
    from rbx import acting
    acting.wiggle(E, t0 + 0.2, t1, "armR", (18, 10), 6.0, (165, 25))
    lips(E, t0, t1)
    nm = label("name", "SAM", (1.8, 0.6, 7.6), 1.4, "#f2c14e", extrude=0.25, estr=0.5)
    pop_in(nm, w(129), 1.0)
    cam = Cam()
    cam.whip(t0, t0 + 0.12, (-10, -6, 6), (-6, 6, 4), orbit_pos(up(p, 4.6), 8.0, 10, 4), up(p, 4.4), lens=26)
    cam.key(t1, orbit_pos(up(p, 4.6), 6.8, 4, 4), up(p, 4.4), lens=26)
    cam.handheld(1.0)
    sfx(w(129), "u_notif", 0.9)


@S(27, 130, 137, "I have the worst allergies in town: red nose, mountain of tissues")
def s27(t0, t1):
    sam_room(False)
    E = sam(t0, t1, "worried")
    p = (0, 2, 0)
    E.pose(t0, loc=p, rot=0)
    red_nose(E)
    Mt = M("tissue", "#f4f4f4", 0.9)
    for i in range(14):
        tt = sphere(f"tis{i}", 0.45, (-2.5 + (i % 5) * 1.2, 0.0 + (i // 5) * 0.4, 0.3 + (i // 5) * 0.5), Mt, (1, 1, 0.7))
        pop_in(tt, t0 + 0.08 * i, 1.0)
    E.shake(t0 + 0.3, n=2, amp=10)
    E.face(w(133), eyes="cry", mouth="wavy")
    cam = Cam()
    cam.push(t0, t1, up(p, 3.6), 10.0, 6.5, yaw=-12, pitch=10, lens=26, yaw1=6)
    cam.crash(w(133), 26, 32, 0.08)
    cam.handheld(0.8)
    sfx(w(133), "snort", 0.8)


def _allergy_flash(t0, t1, what, i):
    sam_room(False)
    E = sam(t0, t1, "gasp")
    p = (0, 2, 0)
    E.pose(t0, loc=p, rot=0)
    red_nose(E)
    E.act(t0 + 0.02, "recoil", 0.9, expr="scared" if i % 2 else "shock")
    if what == "cat":
        c = stray_cat("acat", (1.8, -0.6, 0), rot=-20, scale=0.9)
        pop_in(c, t0, 0.9)
        sfx(t0 + 0.05, "meow")
    elif what == "dust":
        Md = mat("dust", hexc("#b8b0a0"), 0.9, alpha=0.8)
        for k in range(10):
            dd = sphere(f"dust{k}", random.uniform(0.35, 0.6), (random.choice((-1, 1)) * random.uniform(1.4, 2.6), 0.6, random.uniform(3.0, 6.5)), Md)
            pop_in(dd, t0 + 0.02 * k, 1.0)
            noise(dd, "location", 0, 0.4, 8)
        sfx(t0, "poof", 0.6)
    elif what == "flowers":
        for k in range(6):
            col = ["#e8574a", "#f2c14e", "#f09ac2"][k % 3]
            fl = sphere(f"fl{k}", 0.4, ((-1) ** k * (1.5 + (k // 2) * 0.5), 0.8, 3.6 + (k // 2) * 1.2), M("fl" + col, col, 0.5), (1, 1, 0.7))
            pop_in(fl, t0 + 0.03 * k, 1.0)
        sfx(t0, "sparkle", 0.6)
    else:
        c = stray_cat("acat", (2.4, -0.8, 0), rot=-20, scale=0.8)
        for k in range(6):
            col = ["#e8574a", "#f2c14e", "#f09ac2"][k % 3]
            sphere(f"fl{k}", 0.4, ((-1) ** k * (1.8 + (k // 2) * 0.4), 0.8, 6.6 + (k % 3) * 0.4), M("fl" + col, col, 0.5), (1, 1, 0.7))
        Md = mat("dust", hexc("#b8b0a0"), 0.9, alpha=0.7)
        for k in range(6):
            sphere(f"dust{k}", 0.5, ((-1) ** k * random.uniform(1.6, 2.6), 0.6, random.uniform(1, 2.5)), Md)
        E.act(t0 + 0.02, "hands_head", 1.0, expr="panic")
        sfx(t0, "u_slap", 0.6)
    cam = Cam()
    yaw = [-20, 20, -10, 0][i]
    cam.push(t0, t1, up(p, 4.0), 7.0 - i * 0.4, 5.0 - i * 0.4, yaw=yaw, pitch=4, lens=26, yaw1=yaw * 0.5)
    cam.crash(t0, 22, 30, 0.08)
    cam.handheld(1.4)


@S(28, 137, 138, "Cats,")
def s28(t0, t1):
    _allergy_flash(t0, t1, "cat", 0)


@S(29, 138, 139, "dust,")
def s29(t0, t1):
    _allergy_flash(t0, t1, "dust", 1)


@S(30, 139, 140, "flowers,")
def s30(t0, t1):
    _allergy_flash(t0, t1, "flowers", 2)


@S(31, 140, 141, "everything.")
def s31(t0, t1):
    _allergy_flash(t0, t1, "all", 3)


@S(32, 141, 146, "I've taken pills every morning: pill bottle insert, pills pour out")
def s32(t0, t1):
    sam_room(False)
    pb = pill_bottle("bottle", (-4.0, 8.4, 2.9), 1.2)
    pb.rotation_euler = (0, math.radians(0), 0)
    pb.keyframe_insert("rotation_euler", frame=F(t0))
    pb.rotation_euler = (0, math.radians(-70), 0)
    pb.keyframe_insert("rotation_euler", frame=F(t0 + 0.4))
    for i in range(8):
        pl = pill(f"pl{i}", (-3.2, 8.2, 4.3), 0.5, rot=(random.uniform(0, 90), 0, random.uniform(0, 90)))
        keyloc(pl, t0 + 0.3 + i * 0.06, (-3.2, 8.2, 4.3))
        keyloc(pl, t0 + 0.6 + i * 0.06, (-3.6 + random.uniform(-1, 1), 7.6 + random.uniform(-0.6, 0.4), 3.05), "LINEAR")
        pl.scale = (0.001,) * 3
        pl.keyframe_insert("scale", frame=F(t0))
        pl.scale = (0.5,) * 3
        pl.keyframe_insert("scale", frame=F(t0 + 0.3 + i * 0.06))
    cam = Cam()
    cam.push(t0, t1, (-3.8, 8.2, 3.6), 6.0, 4.2, yaw=-20, pitch=22, lens=30, yaw1=-5)
    cam.handheld(0.7)
    sfx(t0 + 0.35, "clink", 0.7)
    sfx(t0 + 0.6, "clink", 0.5)


@S(33, 146, 150, "since I was four: tiny Sam gulps a giant pill")
def s33(t0, t1):
    sam_room(False)
    E = sam(t0, t1, "neutral", scale=0.6)
    p = (0, 2, 0)
    E.pose(t0, loc=p, rot=0)
    pl = pill("bigpill", (0, -0.6, 3.0), 0.9, rot=(90, 0, 0))
    keyloc(pl, t0, (0.9, -0.8, 2.2))
    keyloc(pl, w(149), (0, -0.4, 2.75))
    shrink_out(pl, w(149) + 0.1, 0.9)
    E.face(t0, eyes="wide", mouth="o")
    E.face(w(149) + 0.12, eyes="closed", mouth="grimace")
    E.pose(w(149) + 0.12, head=(0, -16, 0))
    E.pose(w(149) + 0.4, head=(0, 0, 0))
    E.face(w(149) + 0.4, "happy")
    cam = Cam()
    cam.push(t0, t1, up(p, 2.6), 6.0, 4.0, yaw=8, pitch=6, lens=28)
    cam.handheld(0.8)
    sfx(w(149) + 0.12, "u_squeak", 0.9)


@S(34, 150, 158, "The year I sneezed thinking about a giraffe")
def s34(t0, t1):
    sam_room(False)
    E = sam(t0, t1, "happy")
    p = (0, 2, 0)
    E.pose(t0, loc=p, rot=8)
    E.act(t0, "think", 0.8)
    cont = bubble("thought", (3.6, 1.2, 9.4), w(156) - 0.2, None, 1.15, tail_to=up(p, 5.6))
    giraffe("thg", (0, -0.2, -1.5), rot=-60, s=0.28, coll=None).parent = cont
    tc = w(153) + 0.1
    W2.sneeze(E, w(152), tc)
    E.face(tc + 0.3, "joy")
    E.act(tc + 0.3, "think", 0.8)
    cam = Cam()
    cam.push(t0, t1, (1.6, 1.8, 6.4), 12.0, 9.0, yaw=8, pitch=6, lens=24, yaw1=-6)
    cam.crash(tc, 24, 30, 0.08)
    cam.handheld(0.9)
    sfx(tc, "sneeze", 0.8)


@S(35, 158, 166, "and woke up in a zoo in Kenya: giraffe licks Sam in the hay")
def s35(t0, t1):
    savanna()
    gf = giraffe("gir", (5, 5, 0), rot=50, s=1.0)
    E = sam(t0, t1, "sleepy")
    p = (1.5, 2.5, 1.2)
    E.pose(t0, loc=p, rot=0)
    E.root.rotation_euler[0] = math.radians(-80)
    E.root.keyframe_insert("rotation_euler", index=0, frame=F(t0))
    E.face(t0, eyes="closed", mouth="smile")
    E.face(w(160), eyes="wide", mouth="grimace")
    ta = w(158) + 0.1
    W2.appear(E, ta, t0)
    W2.poof("poof", up(p, 1.0), ta, 0.8)
    nk = D.objects["gir_neckpiv"]
    nk.keyframe_insert("rotation_euler", frame=F(w(160)))
    nk.rotation_euler[0] = math.radians(-55)
    nk.keyframe_insert("rotation_euler", frame=F(w(160) + 0.5))
    cam = Cam()
    cam.key(t0, (-3, -5, 5), (2.0, 3.5, 3.0), lens=24, focus=9.0, fstop=6)
    cam.key(t1, (-6, -9, 7), (3, 5, 5.0), lens=20, focus=14.0, fstop=8)
    cam.crash(w(164), 18, 22, 0.1)
    cam.handheld(0.9)
    sfx(ta, "poof")
    sfx(w(160) + 0.3, "splat", 0.5)
    sfx(w(165), "u_quack", 0.7)


@S(36, 166, 170, "I haven't sneezed since: Sam pinches his nose shut, determined")
def s36(t0, t1):
    sam_room(False)
    E = sam(t0, t1, "determined")
    p = (0, 2, 0)
    E.pose(t0, loc=p, rot=0)
    E.act(t0, "hands_face", 0.7, expr="determined")
    E.face(t0, eyes="angry", mouth="flat")
    cam = Cam()
    cam.push(t0, t1, up(p, 4.6), 6.0, 4.0, yaw=0, pitch=2, lens=30, yaw1=8)
    cam.handheld(0.5)


# ================================================================== INCITING (40-49s)
@S(37, 170, 176, "Then one night, my little sister: snowy yard, cabin, Mia in pink")
def s37(t0, t1):
    snow_forest(seed=11, cabin=True)
    Mi = mia(t0, t1, "happy")
    p = (2, 4, 0)
    Mi.pose(t0, loc=p, rot=-20)
    Mi.act(w(173), "wave", 0.9)
    snowfall("snow", (2, 2, 0), (30, 30, 14), t0, t1, n=180, wind=1.0, speed=1.6)
    night_rig(up(p, 3))
    cam = Cam()
    cam.key(t0, (-10, -20, 14), (6, 14, 4), lens=20, focus=26.0, fstop=8)
    cam.key(t1, (-3, -9, 5.0), (2, 4, 3.4), lens=24, focus=13.0, fstop=6)
    cam.handheld(0.8)
    sfx(t0, "wind", 0.5, dur=t1 - t0)


@S(38, 176, 184, "Mia chased a stray cat into the woods: tracking run")
def s38(t0, t1):
    snow_forest(seed=11, cabin=True)
    c = stray_cat("cat", (0, 0, 0), sit=False, scale=0.6)
    keyloc(c, t0, (-2, 6, 0), "LINEAR")
    keyloc(c, t1, (-14, 28, 0), "LINEAR")
    c.rotation_euler[2] = math.radians(facing((-2, 6), (-14, 28)))
    Mi = mia(t0, t1, "happy")
    from rbx import acting
    acting.run(Mi, t0, t1, (3, -2, 0), (-9, 20, 0), rate=3.2)
    snowfall("snow", (-4, 10, 0), (36, 36, 14), t0, t1, n=200, wind=1.5)
    night_rig((-4, 10, 3))
    cam = Cam()
    cam.track(Mi, t0, t1, offset=(7.0, -7.0, 3.5), look_up=3.0, lens=24, fstop=5)
    cam.handheld(1.2)
    sfx(t0, "meow", 0.8)
    sfx(t0 + 0.2, "footsteps", 0.6, dur=t1 - t0)


@S(39, 184, 187, "A snowstorm hit: violent snow, camera shakes, trees sway")
def s39(t0, t1):
    snow_forest(seed=11, dark=True)
    for ob in D.objects:
        if ob.name.startswith("sf_pine") and ob.parent is None:
            noise(ob, "rotation_euler", 0, 0.05, 6)
    snowfall("snow", (0, -4, 0), (30, 30, 16), t0, t1, n=520, wind=14.0, speed=4.5, flake=0.09)
    cam = Cam()
    cam.key(t0, (0, -16, 7), (0, 10, 6), lens=22, focus=14.0, fstop=8)
    cam.key(t1, (0, -11, 6), (0, 10, 6), lens=24, focus=12.0, fstop=8)
    cam.handheld(3.0)
    cam.shake(0.02, 4)
    sfx(t0 - 0.1, "wind", 1.0, dur=t1 - t0 + 0.4)
    sfx(t0, "u_boom", 0.35)


@S(40, 187, 193, "The search teams couldn't find her: flashlight beams in the storm")
def s40(t0, t1):
    snow_forest(seed=12, dark=True)
    pts = [(-6, 6, 0), (0, 10, 0), (6, 5, 0), (-2, 16, 0)]
    for i, pp in enumerate(pts):
        s_ = searcher(i, t0, t1)
        s_.pose(t0, loc=pp, rot=random.uniform(-40, 40) + 180)
        s_.pose(t1, rot=random.uniform(-60, 60) + 180)
        s_.pose(t0, armR=(80, -6))
        s_.pose((t0 + t1) / 2, armR=(70, 10))
        s_.pose(t1, armR=(85, -15))
    snowfall("snow", (0, 4, 0), (34, 34, 16), t0, t1, n=320, wind=8.0, speed=3.5)
    cam = Cam()
    cam.key(t0, (14, -14, 16), (0, 9, 2), lens=20, focus=24.0, fstop=8)
    cam.key(t1, (6, -18, 20), (0, 9, 1), lens=20, focus=28.0, fstop=8)
    cam.handheld(1.2)
    sfx(t0, "wind", 0.6, dur=t1 - t0)
    sfx(w(190), "footsteps", 0.5, dur=1.0)


@S(41, 193, 195, "Nobody could: lone searcher drops his flashlight, slumps")
def s41(t0, t1):
    snow_forest(seed=12, dark=True)
    s_ = searcher(0, t0, t1, "cry")
    p = (0, 2, 0)
    s_.pose(t0, loc=p, rot=0)
    s_.act(t0 + 0.1, "slump", 1.0)
    s_.face(t0 + 0.1, "cry")
    snowfall("snow", (0, 0, 0), (20, 20, 12), t0, t1, n=220, wind=6.0)
    night_rig(up(p, 3))
    cam = Cam()
    cam.push(t0, t1, up(p, 4.4), 9.0, 6.5, yaw=10, pitch=1, lens=26)
    cam.handheld(0.8)
    sfx(t0, "aww", 0.6)


@S(42, 195, 204, "But I didn't need to know where she was: Sam at the night window")
def s42(t0, t1):
    sam_room(True)
    E = sam(t0, t1, "worried")
    p = (3.0, 7.0, 0)
    E.pose(t0, loc=p, rot=180)
    E.pose(w(198), rot=150)
    E.face(w(198), "determined")
    E.pose(w(201), rot=0)
    E.act(w(201), "fists", 0.9, expr="determined")
    cam = Cam()
    cam.key(t0, (6, -4, 6.5), up(p, 4.4), lens=24, focus=12.0, fstop=4)
    cam.key(t1, (4.2, 0.5, 5.4), up(p, 4.6), lens=28, focus=7.0, fstop=3)
    cam.handheld(0.7)
    sfx(w(201), "whoosh", 0.6)


@S(43, 204, 213, "I just needed to think about her and sneeze: Mia in the thought bubble, DING")
def s43(t0, t1):
    sam_room(True)
    E = sam(t0, t1, "determined")
    p = (3.0, 5.0, 0)
    E.pose(t0, loc=p, rot=0)
    E.act(t0, "think", 0.8)
    cont = bubble("thought", (6.6, 4.4, 9.0), w(208), None, 1.1, tail_to=up(p, 5.6))
    Mi = chars.Char("MiaT", skin="#f2dbc6", shirt="#f06aa8", pants="#7a5ab0", hair="bob", hair_color="#5a3a22",
                    face="girl", sleeves="long", scale=0.42)
    Mi.face(t0, "happy")
    Mi.root.parent = cont
    Mi.root.location = (0, -0.2, -1.9)
    E.face(w(211), eyes="happy", mouth="grin")
    cam = Cam()
    cam.push(t0, t1, (4.6, 4.8, 6.6), 12.0, 8.5, yaw=6, pitch=4, lens=24, yaw1=-6)
    cam.crash(w(212), 24, 30, 0.1)
    cam.handheld(0.7)
    sfx(w(208), "u_correct", 0.8)


# ================================================================== PEPPER (49-60s)
@S(44, 213, 218, "My pills were still working: Sam strains, nothing, pill bottle glares")
def s44(t0, t1):
    sam_room(True)
    E = sam(t0, t1, "angry")
    p = (0, 3, 0)
    E.pose(t0, loc=p, rot=-10)
    E.pose(t0, head=(0, -20, 0), torso=(0, -8, 0))
    E.face(t0, eyes="half", mouth="ah")
    E.pose(w(216), head=(0, 0, 0), torso=(0, 0, 0))
    E.face(w(216), eyes="angry", mouth="grimace")
    pill_bottle("bottle", (-4.0, 8.4, 2.9), 0.9)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.2), 7.5, 5.5, yaw=-20, pitch=4, lens=26, yaw1=-36)
    cam.handheld(0.8)
    sfx(w(216), "buzzer", 0.5)


@S(45, 218, 222, "My nose was dead: extreme close, nose deflates, flies buzz")
def s45(t0, t1):
    sam_room(True)
    E = sam(t0, t1, "bored")
    p = (0, 3, 0)
    E.pose(t0, loc=p, rot=0)
    n = red_nose(E)
    n.scale = (1, 1, 1)
    n.keyframe_insert("scale", frame=F(w(221) - 0.05))
    n.scale = (0.6, 0.6, 0.6)
    n.keyframe_insert("scale", frame=F(w(221) + 0.12))
    E.face(w(221), eyes="half", mouth="frown")
    E.act(w(221), "slump", 0.7)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.4), 4.6, 3.6, yaw=4, pitch=0, lens=34)
    cam.crash(w(221), 34, 40, 0.1)
    cam.handheld(0.5)
    sfx(w(221), "u_fart", 1.0)


@S(46, 222, 230, "So I broke into grandma's secret pepper drawer: drawer slides, golden glow")
def s46(t0, t1):
    kitchen(True)
    E = sam(t0, t1, "determined")
    p = (-6, 4.4, 0)
    E.pose(t0, loc=(-11, 1, 0), rot=60)
    E.walk(t0, w(226), (-11, 1, 0), p, rate=3.0)
    E.pose(w(226) + 0.05, rot=180)
    to = w(228)
    E.act(to - 0.15, "reach", 1.0, expr="determined")
    dr, gr = pepper_drawer(to)
    E.face(to + 0.2, eyes="wide", mouth="open_smile")
    E.act(to + 0.3, "shock", 0.6)
    cam = Cam()
    cam.key(t0, (2, -6, 7), (-8, 3, 3), lens=22, focus=12.0, fstop=4)
    cam.key(to, (-2, -1.5, 5.5), (-6, 6, 3.2), lens=26, focus=6.5, fstop=3)
    cam.key(t1, (-3.2, 0.5, 4.8), (-6, 6.4, 2.6), lens=28, focus=5.5, fstop=3)
    cam.handheld(0.9)
    sfx(to, "door", 0.6)
    sfx(to + 0.1, "sparkle", 0.9)


@S(47, 230, 234, "opened the whole grinder: top twists off, insert")
def s47(t0, t1):
    kitchen(True)
    gr = grinder("grinder", (-6, 8.0, 3.7), 1.2)
    top = D.objects["grinder_toppiv"]
    top.keyframe_insert("location", frame=F(t0 + 0.1))
    top.keyframe_insert("rotation_euler", frame=F(t0 + 0.1))
    top.rotation_euler[2] = math.radians(540)
    top.keyframe_insert("rotation_euler", frame=F(w(232)))
    top.location = (0.8, -0.3, 3.4)
    top.rotation_euler[1] = math.radians(70)
    top.keyframe_insert("location", frame=F(w(232) + 0.25))
    top.keyframe_insert("rotation_euler", frame=F(w(232) + 0.25))
    lt = light("gl", "POINT", (-6, 6.4, 7.5), 200, (1.0, 0.85, 0.5), 0.6)
    cam = Cam()
    cam.push(t0, t1, (-6, 8.0, 5.4), 6.0, 4.4, yaw=-20, pitch=12, lens=30, yaw1=10)
    cam.handheld(0.8)
    sfx(t0 + 0.15, "click", 0.7)
    sfx(w(232), "pop", 0.8)


@S(48, 234, 242, "and breathed it in like a vacuum cleaner: pepper streams up his nose")
def s48(t0, t1):
    kitchen(True)
    E = sam(t0, t1, "determined")
    p = (-6, 3.4, 0)
    E.pose(t0, loc=p, rot=0)
    E.pose(t0, armL=(70, -10), armR=(70, -10), head=(0, 18, 0))
    gr = grinder("grinder", (0, -0.9, -1.9), 0.55, parent=E.shR)
    nose = up(p, 4.4)
    nose = (p[0], p[1] - 0.6, 4.4)
    src = (p[0], p[1] - 1.6, 3.4)
    pepper_cloud("pep", src, nose, w(235), t1 + 0.2, n=60, seed=3)
    E.face(w(235), eyes="closed", mouth="o")
    E.pose(w(240), head=(0, -20, 0), torso=(0, -8, 0))
    E.face(w(240), eyes="wide", mouth="o")
    cam = Cam()
    cam.push(t0, t1, up(p, 4.0), 7.0, 4.4, yaw=-10, pitch=-4, lens=26, yaw1=16)
    cam.crash(w(240), 26, 34, 0.15)
    cam.handheld(1.6)
    sfx(w(235), "wind", 0.9, dur=t1 - w(235))
    sfx(w(235), "jet", 0.4)


@S(49, 242, 245, "My eyes watered: tears spray sideways")
def s49(t0, t1):
    kitchen(True)
    E = sam(t0, t1, "cry")
    p = (-6, 3.4, 0)
    E.pose(t0, loc=p, rot=0)
    E.face(t0, eyes="cry", mouth="grimace_wide")
    tears(E, t0 + 0.05, t1, n=12)
    noise(E.neck, "rotation_euler", 2, 0.08, 2)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.6), 4.6, 3.8, yaw=-4, pitch=0, lens=32)
    cam.handheld(1.6)
    sfx(t0 + 0.05, "splat", 0.4)


@S(50, 245, 248, "My brain screamed: red pulse, crash zoom, FAAAH")
def s50(t0, t1):
    kitchen(True)
    E = sam(t0, t1, "panic")
    p = (-6, 3.4, 0)
    E.pose(t0, loc=p, rot=0)
    E.act(t0, "hands_head", 1.0, expr="panic")
    lt = light("redpulse", "POINT", (-6, 0.6, 6.5), 0, (1.0, 0.15, 0.1), 2.0)
    for k in range(4):
        lt.data.energy = 0
        lt.data.keyframe_insert("energy", frame=F(t0 + k * 0.22))
        lt.data.energy = 2500
        lt.data.keyframe_insert("energy", frame=F(t0 + k * 0.22 + 0.08))
    cam = Cam()
    cam.push(t0, t1, up(p, 4.6), 6.0, 3.8, yaw=0, pitch=-6, lens=28)
    cam.crash(t0 + 0.02, 22, 34, 0.12)
    cam.handheld(2.4)
    cam.shake(0.015, 3)
    sfx(t0, "u_faaah", 0.9)


@S(51, 248, 258, "I thought about Mia's face as hard as I could: riser, ultra push, bubble")
def s51(t0, t1):
    kitchen(True)
    E = sam(t0, t1, "determined")
    p = (-6, 3.4, 0)
    E.pose(t0, loc=p, rot=0)
    E.act(t0, "fists", 0.9, expr="determined")
    E.face(t0, eyes="closed", mouth="grimace")
    cont = bubble("thought", (-9.4, 5.0, 9.4), w(251), None, 1.1, tail_to=up(p, 5.6))
    Mi = chars.Char("MiaT", skin="#f2dbc6", shirt="#f06aa8", pants="#7a5ab0", hair="bob", hair_color="#5a3a22",
                    face="girl", sleeves="long", scale=0.42)
    Mi.face(t0, "happy")
    Mi.root.parent = cont
    Mi.root.location = (0, 0.2, -1.9)
    W2.sneeze(E, w(255), t1 + 0.4, mist=False)
    noise(E.hip, "location", 0, 0.03, 1.5)
    cam = Cam()
    cam.push(t0, t1, (-7.2, 3.6, 5.6), 12.0, 6.0, yaw=12, pitch=2, lens=24, lens1=30)
    cam.handheld(1.0)
    cam.shake(0.006, 2)
    sfx(w(258), "u_riser", 1.0)


@S(52, 258, 259, "ACHOO!: giant sneeze, white flash, POOF")
def s52(t0, t1):
    kitchen(True)
    E = sam(t0, t1, "neutral")
    p = (-6, 3.4, 0)
    E.pose(t0, loc=p, rot=0)
    tc = t0 + 0.12
    W2.sneeze(E, t0 - 0.3, tc)
    tv = tc + 0.2
    W2.vanish(E, tv)
    W2.poof("poof", up(p, 4.0), tv, 1.0)
    flash(tc, 3.0, 0.35)
    cam = Cam()
    cam.push(t0, t1, up(p, 4.4), 5.0, 6.5, yaw=4, pitch=2, lens=26)
    cam.crash(tc, 26, 18, 0.1)
    cam.handheld(2.5)
    cam.shake(0.02, 3)
    sfx(tc, "sneeze")
    sfx(tc, "u_boom", 0.8)
    sfx(tv, "poof")


# ================================================================== THE FOREST (60-75s)
@S(53, 259, 260, "Snow.: Sam slams down into deep snow")
def s53(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "gasp")
    p = (0, 0, 0)
    E.pose(t0, loc=p, rot=0, hipz=-1.0)
    ta = t0 + 0.1
    W2.appear(E, ta, t0)
    W2.poof("poof", up(p, 3.0), ta, 0.8)
    snowfall("snow", (0, 0, 0), (20, 20, 12), t0, t1, n=300, wind=10.0, speed=4)
    night_rig(up(p, 3))
    cam = Cam()
    cam.push(t0, t1, up(p, 3.6), 6.0, 5.0, yaw=-14, pitch=12, lens=26)
    cam.handheld(2.0)
    sfx(ta, "poof")
    sfx(ta + 0.05, "thud", 0.9)
    sfx(t0, "wind", 0.8, dur=2.0)


@S(54, 260, 261, "Darkness.: tiny Sam in a black storm, lights fade")
def s54(t0, t1):
    snow_forest(seed=21, dark=True, moon=False)
    E = sam(t0, t1, "scared")
    E.pose(t0, loc=(0, 0, 0), rot=0)
    E.act(t0, "brace", 0.8)
    snowfall("snow", (0, -4, 0), (40, 40, 20), t0, t1, n=320, wind=12.0, speed=4)
    lt = light("nr_fill", "AREA", (0, -10, 8), 700, (0.6, 0.7, 1.0), 10, target=(0, 0, 3))
    lt.data.keyframe_insert("energy", frame=F(t0))
    lt.data.energy = 120
    lt.data.keyframe_insert("energy", frame=F(t1))
    cam = Cam()
    cam.key(t0, (4, -16, 12), (0, 0, 2), lens=24, focus=19.0, fstop=8)
    cam.key(t1, (5, -20, 16), (0, 0, 2), lens=24, focus=24.0, fstop=8)
    cam.handheld(1.4)


@S(55, 261, 267, "And right in front of me: Sam turns, whip pan to a shape in the snow")
def s55(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "scared")
    p = (0, 0, 0)
    E.pose(t0, loc=p, rot=0)
    E.pose(w(264), rot=180)
    E.face(w(264), "gasp")
    Mi = mia(t0, t1, "cry")
    pm = (0, 7, 0)
    Mi.pose(t0, loc=pm, rot=0, hipz=-0.5)
    Mi.act(t0, "hold", 1.0)
    hold_cat(Mi, local=(0, -0.95, 0.35))
    snowfall("snow", (0, 3, 0), (24, 24, 12), t0, t1, n=260, wind=6.0)
    night_rig((0, 3, 3))
    cam = Cam()
    cam.key(t0, orbit_pos(up(p, 4.4), 6.0, 0, 4), up(p, 4.4), lens=26, focus=6.0, fstop=4)
    cam.key(w(265), orbit_pos(up(p, 4.4), 6.0, 0, 4), up(p, 4.4), lens=26, focus=6.0, fstop=4)
    cam.whip(w(265) + 0.02, w(266), orbit_pos(up(p, 4.4), 6.0, 0, 4), up(p, 4.4), (1.6, -1.6, 5.0), up(pm, 3.0), lens=28)
    cam.key(t1, (1.3, -0.6, 4.8), up(pm, 3.0), lens=30)
    cam.handheld(1.0)
    sfx(w(266), "gasp", 0.8)


@S(56, 267, 269, "Mia, shivering: Mia close, shaking, frosty")
def s56(t0, t1):
    snow_forest(seed=21, dark=True)
    Mi = mia(t0, t1, "scared")
    p = (0, 7, 0)
    Mi.pose(t0, loc=p, rot=0, hipz=-0.5)
    Mi.act(t0, "hold", 1.0)
    hold_cat(Mi)
    noise(Mi.root, "location", 0, 0.05, 0.6)
    noise(Mi.neck, "rotation_euler", 2, 0.05, 0.8)
    Mi.face(t0, eyes="scared", mouth="wavy")
    snowfall("snow", (0, 4, 0), (20, 20, 12), t0, t1, n=240, wind=6.0)
    night_rig(up(p, 3))
    cam = Cam()
    cam.push(t0, t1, up(p, 3.4), 6.0, 4.4, yaw=-4, pitch=4, lens=30)
    cam.handheld(1.0)
    sfx(t0, "u_riser", 0.0)


@S(57, 269, 273, "hugging that stray cat: insert on the cat in her arms")
def s57(t0, t1):
    snow_forest(seed=21, dark=True)
    Mi = mia(t0, t1, "scared")
    p = (0, 7, 0)
    Mi.pose(t0, loc=p, rot=0, hipz=-0.5)
    Mi.act(t0, "hold", 1.0)
    hold_cat(Mi)
    Mi.face(t0, eyes="closed", mouth="wavy")
    snowfall("snow", (0, 4, 0), (16, 16, 10), t0, t1, n=200, wind=4.0)
    night_rig(up(p, 2.5))
    cam = Cam()
    cam.orbit(t0, t1, up(p, 2.4), 4.2, -20, 20, pitch=12, lens=32, fstop=2.8)
    cam.handheld(0.7)
    sfx(t0 + 0.2, "meow", 0.7)


@S(58, 273, 275, "She smiled: warm light blooms on Mia's face")
def s58(t0, t1):
    snow_forest(seed=21, dark=True)
    Mi = mia(t0, t1, "scared")
    p = (0, 7, 0)
    Mi.pose(t0, loc=p, rot=0, hipz=-0.5)
    Mi.act(t0, "hold", 1.0)
    hold_cat(Mi)
    Mi.face(w(274), eyes="happy", mouth="smile")
    lt = light("warm", "AREA", (0, 3.0, 4.5), 0, (1.0, 0.75, 0.45), 3, target=up(p, 3.2))
    lt.data.keyframe_insert("energy", frame=F(t0))
    lt.data.energy = 500
    lt.data.keyframe_insert("energy", frame=F(t1))
    snowfall("snow", (0, 4, 0), (16, 16, 10), t0, t1, n=150, wind=2.0, speed=1.5)
    night_rig(up(p, 3))
    cam = Cam()
    cam.push(t0, t1, up(p, 3.6), 4.6, 3.6, yaw=0, pitch=2, lens=32)
    cam.handheld(0.4)
    sfx(w(274), "sparkle", 0.8)


@S(59, 275, 279, "I knew you'd come: Mia talks, two-shot with Sam kneeling")
def s59(t0, t1):
    snow_forest(seed=21, dark=True)
    Mi = mia(t0, t1, "happy")
    pm = (0, 7, 0)
    Mi.pose(t0, loc=pm, rot=0, hipz=-0.5)
    Mi.act(t0, "hold", 1.0)
    hold_cat(Mi)
    lips(Mi, t0, t1)
    E = sam(t0, t1, "relief")
    pe = (0, 3.4, 0)
    E.pose(t0, loc=pe, rot=180, hipz=-0.9, legL=(60, 5), legR=(-10, 5))
    snowfall("snow", (0, 4, 0), (20, 20, 12), t0, t1, n=160, wind=2.0, speed=1.5)
    night_rig((0, 5, 3), cam_side=(-12, 6, 6))
    cam = Cam()
    cam.push(t0, t1, (0, 5.2, 3.2), 12.0, 10.0, yaw=-75, pitch=4, lens=22, yaw1=-60)
    cam.handheld(0.6)


@S(60, 279, 285, "But I had no pepper left: Sam shakes the empty grinder, nothing")
def s60(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "worried")
    p = (0, 3.4, 0)
    E.pose(t0, loc=p, rot=0)
    E.pose(t0, armR=(110, -10))
    gr = grinder("grinder", (0, 0, -1.9), 0.55, parent=E.shR)
    gr.rotation_euler = (math.radians(180), 0, 0)
    for k in range(6):
        E.pose(w(281) + k * 0.15, armR=(125 if k % 2 else 100, -10))
    E.face(w(283), eyes="worried", mouth="frown")
    snowfall("snow", (0, 2, 0), (20, 20, 12), t0, t1, n=200, wind=5.0)
    night_rig(up(p, 3))
    cam = Cam()
    cam.push(t0, t1, up(p, 5.0), 7.0, 5.0, yaw=14, pitch=8, lens=26, yaw1=-6)
    cam.handheld(1.0)
    for k in range(3):
        sfx(w(281) + k * 0.3, "clink", 0.4)
    sfx(w(284), "crickets", 0.5, dur=0.6)


@S(61, 285, 288, "No way home: huge crane up, two tiny figures in the storm")
def s61(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "worried")
    E.pose(t0, loc=(0, 3.4, 0), rot=0)
    Mi = mia(t0, t1, "scared")
    Mi.pose(t0, loc=(0, 7, 0), rot=0, hipz=-0.5)
    hold_cat(Mi)
    snowfall("snow", (0, 0, 0), (60, 60, 30), t0, t1, n=400, wind=10.0, speed=5)
    night_rig((0, 5, 2))
    cam = Cam()
    cam.key(t0, (6, -8, 12), (0, 5, 2), lens=22, focus=16.0, fstop=8)
    cam.key(t1, (12, -20, 42), (0, 6, 0), lens=20, focus=46.0, fstop=8)
    cam.handheld(0.8)
    sfx(t0, "wind", 0.9, dur=t1 - t0)


@S(62, 288, 294, "Then I looked at the cat: slow push, Sam's eyes slide to the cat, DING")
def s62(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "worried")
    pe = (-1.6, 4.0, 0)
    E.pose(t0, loc=pe, rot=60)
    Mi = mia(t0, t1, "scared")
    pm = (1.6, 6.0, 0)
    Mi.pose(t0, loc=pm, rot=-58, hipz=-0.5)
    Mi.act(t0, "hold", 1.0)
    hold_cat(Mi)
    E.face(w(290), eyes="side_l", mouth="flat")
    look_at(E, w(290), (1.6, 5.0, 2.6))
    E.face(w(293), eyes="squint", mouth="smirk")
    snowfall("snow", (0, 3, 0), (20, 20, 12), t0, t1, n=200, wind=3.0)
    night_rig((0, 5, 3))
    cam = Cam()
    cam.push(t0, t1, (0, 5.0, 4.2), 11.0, 8.0, yaw=30, pitch=3, lens=24, yaw1=40)
    cam.handheld(0.5)
    sfx(w(293), "u_correct", 0.9)


@S(63, 294, 298, "I'm allergic to cats: Sam grins, cat side-eyes him")
def s63(t0, t1):
    snow_forest(seed=21, dark=True)
    Mi = mia(t0, t1, "confused")
    pm = (1.6, 6.0, 0)
    Mi.pose(t0, loc=pm, rot=-58, hipz=-0.5)
    Mi.act(t0, "hold", 1.0)
    c = hold_cat(Mi)
    E = sam(t0, t1, "grin")
    pe = (-1.6, 4.0, 0)
    E.pose(t0, loc=pe, rot=60)
    E.face(t0, eyes="happy", mouth="grin")
    look_at(E, t0, (1.6, 5.0, 2.6))
    snowfall("snow", (0, 3, 0), (20, 20, 12), t0, t1, n=200, wind=3.0)
    night_rig((0, 5, 3))
    cam = Cam()
    cam.push(t0, t1, (-0.6, 4.6, 4.4), 8.0, 6.0, yaw=25, pitch=3, lens=26, yaw1=38)
    cam.crash(w(295), 26, 32, 0.1)
    cam.handheld(0.8)
    sfx(w(295), "u_rizz", 0.7)


@S(64, 298, 301, "I grabbed Mia: Sam yanks her close")
def s64(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "determined")
    pe = (-1.6, 4.0, 0)
    E.pose(t0, loc=pe, rot=60)
    Mi = mia(t0, t1, "gasp")
    pm0, pm1 = (1.6, 6.0, 0), (0.2, 4.4, 0)
    Mi.pose(t0, loc=pm0, rot=-58)
    Mi.act(t0, "hold", 1.0)
    hold_cat(Mi)
    tg = w(299)
    E.act(tg - 0.1, "reach", 1.0)
    Mi.pose(tg, loc=pm0)
    Mi.pose(tg + 0.2, loc=pm1)
    E.act(tg + 0.2, "hold", 1.0)
    snowfall("snow", (0, 3, 0), (20, 20, 12), t0, t1, n=200, wind=4.0)
    night_rig((0, 5, 3))
    cam = Cam()
    cam.push(t0, t1, (-0.6, 4.6, 3.8), 9.0, 6.5, yaw=20, pitch=6, lens=24, yaw1=35)
    cam.handheld(1.4)
    sfx(tg, "whoosh", 0.7)
    sfx(tg + 0.2, "u_slap", 0.5)


@S(65, 301, 304, "grabbed the cat: cat yowls, legs splay")
def s65(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "determined")
    pe = (0, 4.0, 0)
    E.pose(t0, loc=pe, rot=0)
    E.act(t0, "hold", 1.0)
    c = hold_cat(E, local=(0, -1.0, 0.6))
    hp = D.objects["cat_headpiv"]
    hp.keyframe_insert("rotation_euler", frame=F(t0))
    hp.rotation_euler[0] = math.radians(-25)
    hp.keyframe_insert("rotation_euler", frame=F(t0 + 0.15))
    keyloc(c, t0, (0, -1.6, 2.0))
    keyloc(c, t0 + 0.2, (0, -1.0, 0.6))
    snowfall("snow", (0, 3, 0), (16, 16, 10), t0, t1, n=160, wind=4.0)
    night_rig(up(pe, 3))
    cam = Cam()
    cam.push(t0, t1, up(pe, 3.6), 5.6, 4.4, yaw=12, pitch=6, lens=28)
    cam.crash(t0 + 0.1, 28, 34, 0.08)
    cam.handheld(1.4)
    sfx(t0 + 0.1, "meow", 1.0)


@S(66, 304, 312, "and pushed my face right into its fur: face in the cat, eyes squeezing")
def s66(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "determined")
    pe = (0, 4.0, 0)
    E.pose(t0, loc=pe, rot=0)
    E.act(t0, "hold", 1.0)
    c = hold_cat(E, local=(0, -1.0, 0.6))
    keyloc(c, t0, (0, -1.0, 0.6))
    keyloc(c, w(307), (0, -0.9, 1.9))
    E.pose(w(307), head=(0, 28, 0))
    E.face(w(307), eyes="closed", mouth="grimace")
    E.face(w(311), eyes="squint", mouth="wavy")
    noise(E.neck, "rotation_euler", 2, 0.06, 1.2)
    snowfall("snow", (0, 3, 0), (16, 16, 10), t0, t1, n=160, wind=3.0)
    night_rig(up(pe, 3))
    cam = Cam()
    cam.push(t0, t1, up(pe, 4.0), 6.5, 3.8, yaw=-35, pitch=4, lens=28, yaw1=-15)
    cam.crash(w(307), 28, 36, 0.12)
    cam.handheld(1.0)
    sfx(w(307), "meow", 0.8)
    sfx(w(310), "snort", 0.8)


@S(67, 312, 317, "I thought about our kitchen: bubble with the kitchen table + Mom; wind-up")
def s67(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "determined")
    pe = (0, 4.0, 0)
    E.pose(t0, loc=pe, rot=0)
    E.act(t0, "hold", 1.0)
    hold_cat(E, local=(0, -1.0, 0.6))
    Mi = mia(t0, t1, "scared")
    Mi.pose(t0, loc=(2.0, 4.6, 0), rot=-20)
    Mi.act(t0, "hold", 0.8)
    cont = bubble("thought", (-3.4, 3.8, 9.6), w(314), None, 1.15, tail_to=up(pe, 5.6))
    box("th_table", (2.6, 1.6, 0.2), (0, 0, -0.6), M("kt_table_s", "#a0703f", 0.6), 0.04, parent=cont)
    for sx in (-1, 1):
        box(f"th_tl{sx}", (0.15, 0.15, 1.0), (sx * 1.1, 0, -1.2), M("kt_table_s", "#a0703f", 0.6), 0.02, parent=cont)
    mm = chars.Char("MomT", skin="#f1dfc6", shirt="#4fb3a0", pants="#3d4a6a", hair="bob", hair_color="#4a2e1c",
                    face="girl", sleeves="long", scale=0.3)
    mm.face(t0, "happy")
    mm.root.parent = cont
    mm.root.location = (0.5, 0.4, -1.75)
    W2.sneeze(E, w(315), t1 + 0.25, mist=False)
    snowfall("snow", (0, 3, 0), (20, 20, 12), t0, t1, n=200, wind=4.0)
    night_rig(up(pe, 3))
    cam = Cam()
    cam.push(t0, t1, (-1.4, 4.0, 6.4), 12.0, 7.5, yaw=-12, pitch=4, lens=24, lens1=28)
    cam.handheld(0.9)
    cam.shake(0.008, 2)
    sfx(w(317), "u_riser", 0.7)


@S(68, 317, 318, "ACHOO!: all three vanish in a giant poof")
def s68(t0, t1):
    snow_forest(seed=21, dark=True)
    E = sam(t0, t1, "neutral")
    pe = (0, 4.0, 0)
    E.pose(t0, loc=pe, rot=0)
    c = hold_cat(E, local=(0, -1.0, 0.6))
    Mi = mia(t0, t1, "scared")
    Mi.pose(t0, loc=(2.0, 4.6, 0), rot=-20)
    tc = t0 + 0.1
    W2.sneeze(E, t0 - 0.3, tc)
    tv = tc + 0.18
    W2.vanish(E, tv, extra=[c] + list(c.children_recursive))
    W2.vanish(Mi, tv)
    W2.poof("poof", (1, 4.2, 3.8), tv, 1.6)
    flash(tc, 3.0, 0.35)
    night_rig(up(pe, 3))
    cam = Cam()
    cam.push(t0, t1, up(pe, 4.0), 6.0, 8.0, yaw=10, pitch=4, lens=26)
    cam.crash(tc, 26, 18, 0.1)
    cam.handheld(2.5)
    cam.shake(0.02, 3)
    sfx(tc, "sneeze")
    sfx(tc, "u_boom", 0.9)
    sfx(tv, "poof")


# ================================================================== PAYOFF (75-84s)
@S(69, 318, 325, "We landed right on the kitchen table: crash onto the table, plates jump")
def s69(t0, t1):
    kitchen(False)
    ta = t0 + 0.1
    E = sam(t0, t1, "shock")
    pe = (-1.2, 0, 3.6)
    E.pose(t0, loc=up(pe, 2.5), rot=0)
    E.pose(ta + 0.18, loc=pe, hipz=-0.3)
    E.pose(ta + 0.35, hipz=0.0)
    c = hold_cat(E, local=(0, -1.0, 0.6))
    E.act(ta, "hold", 1.0)
    Mi = mia(t0, t1, "gasp")
    pm = (1.8, 0.3, 3.6)
    Mi.pose(t0, loc=up(pm, 2.5), rot=-10)
    Mi.pose(ta + 0.2, loc=pm, hipz=-0.3)
    Mi.pose(ta + 0.38, hipz=0.0)
    W2.appear(E, ta, t0, extra=[c] + list(c.children_recursive))
    W2.appear(Mi, ta, t0)
    W2.poof("poof", (0.3, 0, 7), ta, 1.4)
    for i in range(4):
        pl_ = cyl(f"plate{i}", 0.8, 0.12, (-3 + i * 2.0, -1.6, 3.65), M("plate", "#f4f4f4", 0.3), 24)
        keyloc(pl_, ta + 0.18, (-3 + i * 2.0, -1.6, 3.65))
        keyloc(pl_, ta + 0.35, (-3 + i * 2.0, -1.9, 5.2))
        keyloc(pl_, ta + 0.6, (-3 + i * 2.0, -1.6, 3.65))
        noise(pl_, "rotation_euler", 0, 0.2, 6)
    E.face(w(323), "gasp")
    cam = Cam()
    cam.key(t0, (6, -12, 9), (0, 0, 5), lens=22, focus=15.0, fstop=6)
    cam.key(t1, (4, -9, 7), (0, 0, 5.4), lens=24, focus=11.0, fstop=6)
    cam.handheld(1.4)
    sfx(ta, "poof")
    sfx(ta + 0.18, "thud", 1.0)
    sfx(ta + 0.25, "clink", 0.8)


@S(70, 325, 329, "in front of Mom: Mom drops her mug, jaw on the floor")
def s70(t0, t1):
    kitchen(False)
    Mo = mom(t0, t1, "shock")
    p = (0, -5.0, 0)
    Mo.pose(t0, loc=p, rot=180)
    Mo.act(t0 + 0.05, "shock", 1.0, expr="shock")
    mg = cyl("mug", 0.35, 0.7, (0, -0.4, -1.9), M("mug", "#f4f4f4", 0.3), 16, parent=Mo.shR)
    Mo.face(w(327), eyes="cry", mouth="o")
    cam = Cam()
    cam.push(t0, t1, up(p, 4.4), 7.0, 4.6, yaw=180, pitch=2, lens=28)
    cam.crash(w(327), 22, 32, 0.1)
    cam.handheld(1.0)
    sfx(w(327), "gasp", 0.9)


@S(71, 329, 334, "Mom cried and hugged us: group hug, tears")
def s71(t0, t1):
    kitchen(False)
    Mo = mom(t0, t1, "cry")
    p = (0, -2.2, 0)
    Mo.pose(t0, loc=p, rot=0)
    Mo.act(t0, "hold", 1.0)
    E = sam(t0, t1, "relief")
    Mi = mia(t0, t1, "relief")
    E.pose(t0, loc=(-1.0, -3.6, 0), rot=160)
    Mi.pose(t0, loc=(1.0, -3.6, 0), rot=200)
    E.act(t0, "hold", 0.8)
    Mi.act(t0, "hold", 0.8)
    tears(Mo, t0 + 0.2, t1, n=10)
    cam = Cam()
    cam.orbit(t0, t1, (0, -2.8, 4.2), 9.0, -30, 10, pitch=8, lens=26)
    cam.handheld(0.6)
    sfx(t0 + 0.1, "aww", 0.9)


@S(72, 334, 340, "so hard I could barely breathe: Sam squished, eyes bulge")
def s72(t0, t1):
    kitchen(False)
    Mo = mom(t0, t1, "cry")
    p = (0, -2.2, 0)
    Mo.pose(t0, loc=p, rot=0)
    Mo.act(t0, "hold", 1.0)
    E = sam(t0, t1, "relief")
    pe = (-0.6, -3.4, 0)
    E.pose(t0, loc=pe, rot=0)
    Mo.pose(t0, loc=(0.6, -2.2, 0))
    E.face(w(337), eyes="terror", mouth="grimace")
    E.root.scale = (1, 1, 1)
    E.root.keyframe_insert("scale", frame=F(w(336)))
    E.root.scale = (0.82, 1.0, 1.08)
    E.root.keyframe_insert("scale", frame=F(w(336) + 0.15))
    cam = Cam()
    cam.push(t0, t1, (0, -2.8, 4.8), 7.0, 5.4, yaw=-6, pitch=4, lens=28)
    cam.crash(w(338), 30, 36, 0.1)
    cam.handheld(1.0)
    sfx(w(336), "u_squeak", 0.9)


@S(73, 340, 344, "We kept the cat: the cat on the table with its own bowl")
def s73(t0, t1):
    kitchen(False)
    c = stray_cat("cat", (0, 0.4, 3.6), scale=0.8)
    cyl("bowl", 0.7, 0.35, (1.4, -0.4, 3.75), M("bowl", "#e8574a", 0.4), 24)
    collar = cyl("collar", 0.48, 0.12, (0, -0.15, 1.1), M("collar", "#e84a8a", 0.4), 24, parent=c)
    cam = Cam()
    cam.orbit(t0, t1, (0.4, 0.2, 4.6), 5.5, -25, 15, pitch=10, lens=30)
    cam.handheld(0.5)
    sfx(t0 + 0.15, "meow", 0.9)
    sfx(w(343), "sparkle", 0.6)


@S(74, 344, 351, "Now I sneeze forty times a day: POOF POOF POOF around the house, counter")
def s74(t0, t1):
    living()
    spots = [(-4.5, 3.5, 0), (4.0, 3.0, 0), (1.5, 6.4, 2.2), (-6.0, 0.5, 0), (-1.2, 2.6, 0)]
    E = sam(t0, t1, "terror")
    n = len(spots)
    dt = (t1 - t0) / n
    for k, pp in enumerate(spots):
        tk = t0 + k * dt
        E.pose(tk, loc=pp, rot=random.uniform(-25, 25), interp="CONSTANT")
        if k:
            W2.poof(f"poof{k}", up(pp, 3.8), tk, 0.8, seed=k)
            sfx(tk, "poof", 0.8)
            E.face(tk, ["terror", "shock", "panic", "gasp"][k % 4])
    ct = label("count", "40x", (4.2, 2.0, 8.6), 1.8, "#f2c14e", extrude=0.25, estr=0.5)
    pop_in(ct, w(347), 1.0)
    cam = Cam()
    cam.key(t0, (-1, -4.6, 8.5), (0, 3.5, 3.6), lens=17, focus=9.0, fstop=8)
    cam.key(t1, (1, -4.2, 7.5), (0, 3.5, 4.0), lens=18, focus=8.5, fstop=8)
    cam.handheld(1.4)
    sfx(w(347), "u_notif", 0.8)


@S(75, 351, 356, "Yesterday, I thought about pizza: pizza bubble, CHOO")
def s75(t0, t1):
    sam_room(False)
    E = sam(t0, t1, "happy")
    p = (0, 2, 0)
    E.pose(t0, loc=p, rot=8)
    E.act(t0, "think", 0.8)
    cont = bubble("thought", (3.6, 1.2, 9.4), w(354), None, 1.15, tail_to=up(p, 5.6))
    pizza("thpizza", (0, -0.4, 0), 0.8, parent=cont, rot=(80, 0, 0))
    E.face(w(355), eyes="happy", mouth="grin")
    tc = t1 - 0.12
    W2.sneeze(E, w(355), tc)
    cam = Cam()
    cam.push(t0, t1, (1.8, 1.8, 7.0), 13.0, 10.0, yaw=-8, pitch=4, lens=24, yaw1=6)
    cam.crash(tc, 24, 32, 0.08)
    cam.handheld(1.0)
    sfx(tc, "sneeze", 0.9)


@S(76, 356, None, "I'm writing this from Italy: POOF in front of the leaning tower, pizza, wink")
def s76(t0, t1):
    italy()
    E = sam(t0, t1, "grin")
    p = (3, 0, 0)
    E.pose(t0, loc=p, rot=-12)
    ta = t0 + 0.1
    W2.appear(E, ta, t0)
    W2.poof("poof", up(p, 4.0), ta, 1.0)
    E.pose(t0, armR=(100, -10))
    pz = pizza("slice", (0, -0.2, -2.0), 0.55, parent=E.shR, rot=(0, 0, 0))
    E.face(w(358), eyes="wink", mouth="grin")
    E.act(w(359), "point_l", 0.8)
    look_at(E, w(359), (14, 48, 20))
    E.face(w(360) + 0.3, eyes="happy", mouth="grin")
    cam = Cam()
    cam.key(t0, (6, -13, 5.5), (5, 10, 7), lens=20, focus=13.0, fstop=8)
    cam.key(t1, (4.5, -10, 5.0), (5, 12, 7.5), lens=20, focus=10.0, fstop=8)
    cam.handheld(0.8)
    sfx(ta, "poof")
    sfx(w(358), "u_rizz", 0.9)
