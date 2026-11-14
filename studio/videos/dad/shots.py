"""dad: every dad can freeze time while telling a boring story."""
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



# ================================================================== DAD STORY: cast
def dad(t0, t1, expr="smile"):
    D = story._live(chars.Char("Dad", skin="#efd0b0", shirt="#c8a070", shirt_kind="stripes", shirt_c2="#e8d8b8",
                               pants="#4a5a7a", hair="short", hair_color="#4a3020", face="mustache",
                               sleeves="long", extras=("glasses",)), t0, t1, expr)
    return D


def kid_sam(t0, t1, expr="neutral"):
    return sam(t0, t1, expr)


def sis(t0, t1, expr="happy"):
    return mia(t0, t1, expr, 0.78)


def robber(i, t0, t1, expr="angry"):
    R = story._live(chars.Char(f"Robber{i}", skin=["#e2c4a2", "#b98a66", "#efd9c0"][i % 3], shirt="#f2f2f2",
                               shirt_kind="stripes", shirt_c2="#1a1a1e", pants="#1a1a1e", hair="helmet",
                               hair_color="#111114", face="plain", sleeves="long", extras=("glasses",)),
                    t0, t1, expr)
    return R


def blaster(ch, side="R"):
    sh = ch.shR if side == "R" else ch.shL
    g = box(ch.name + "_blaster", (0.3, 0.9, 0.5), (0, -0.5, -1.95), M("blaster", "#2a2a30", 0.4), 0.05,
            parent=sh, coll=ch.coll)
    return g


def guard(t0, t1, expr="smile"):
    return story._live(chars.Char("Guard", skin="#c99a72", shirt="#2a3f7a", pants="#1e2a4a", hair="cap",
                                  hair_color="#1e2a4a", face="mustache", sleeves="long",
                                  extras=("collar:#f4f4f4",), scale=1.1), t0, t1, expr)


def cop(i, t0, t1, expr="happy"):
    return story._live(chars.Char(f"Cop{i}", skin=["#d9b48f", "#a8714a"][i % 2], shirt="#2a4a8a", pants="#1e2a4a",
                                  hair="cap", hair_color="#1e2a4a", face="plain", sleeves="long",
                                  extras=("collar:#f4f4f4",)), t0, t1, expr)


def P(ch, t, loc, rot=0, **kw):
    ch.pose(t, loc=loc, rot=rot, **kw)
    return ch


def talk(ch, t0, t1, expr="talk"):
    lips(ch, t0, t1)
    return ch


# ================================================================== props
def screwdriver(name, loc, s=1.0, coll=None, parent=None, rot=(0, 0, 0)):
    r = empty(name, loc, parent=parent, coll=coll, rot=rot)
    r.scale = (s,) * 3
    cyl(name + "_h", 0.42, 1.8, (0, 0, 0), M("sd_handle", "#e0453a", 0.4), 16, bev=0.05, parent=r, coll=coll)
    cyl(name + "_s", 0.12, 2.4, (0, 0, -2.05), M("sd_steel", "#c8ccd4", 0.2, metal=1), 12, parent=r, coll=coll)
    cyl(name + "_t", 0.18, 0.3, (0, 0, -3.35), M("sd_steel", "#c8ccd4", 0.2, metal=1), 8, parent=r, coll=coll)
    return r


def clock_face(name, loc, t_hands0, t_hands1, s=1.0, coll=None, facing_rot=(90, 0, 0), turns=3.0):
    r = empty(name, loc, coll=coll, rot=facing_rot)
    r.scale = (s,) * 3
    cyl(name + "_rim", 1.9, 0.3, (0, 0, 0), M("clk_rim", "#2a2a30", 0.4), 40, parent=r, coll=coll)
    cyl(name + "_face", 1.7, 0.34, (0, 0, 0.02), M("clk_face", "#fbfbf6", 0.4), 40, parent=r, coll=coll)
    for k in range(12):
        a = k / 12 * math.tau
        box(f"{name}_tick{k}", (0.1, 0.1, 0.34 if k % 3 == 0 else 0.2), (math.sin(a) * 1.45, 0.2, math.cos(a) * 1.45),
            M("clk_tick", "#2a2a30", 0.4), 0, parent=r, coll=coll, rot=(0, 0, 0))
    hp = empty(name + "_hp", (0, 0.22, 0), parent=r, coll=coll)
    box(name + "_hand", (0.14, 0.1, 1.35), (0, 0, 0.6), M("clk_hand", "#d9453a", 0.4), 0.02, parent=hp, coll=coll)
    hp.rotation_euler = (0, 0, 0)
    hp.keyframe_insert("rotation_euler", frame=F(t_hands0))
    hp.rotation_euler = (0, math.radians(-360 * turns), 0)
    hp.keyframe_insert("rotation_euler", frame=F(t_hands1))
    set_interp(hp, "rotation_euler", F(t_hands0), "LINEAR")
    return r


def trophy(name, loc, s=1.0, coll=None, color="#f2c14e"):
    r = empty(name, loc, coll=coll)
    r.scale = (s,) * 3
    Mg = M("gold", color, 0.2, metal=1)
    cyl(name + "_base", 1.3, 0.6, (0, 0, 0.3), M("tr_base", "#3a2a1e", 0.5), 20, parent=r, coll=coll)
    cyl(name + "_stem", 0.3, 1.6, (0, 0, 1.4), Mg, 12, parent=r, coll=coll)
    cyl(name + "_cup", 1.1, 1.7, (0, 0, 3.0), Mg, 20, parent=r, coll=coll, r2=0.5)
    for sx in (-1, 1):
        cyl(name + f"_h{sx}", 0.4, 0.14, (sx * 1.25, 0, 3.1), Mg, 12, parent=r, coll=coll, rot=(90, 0, 0))
    return r


def battery(name, loc, s=1.0, coll=None, rot=(0, 0, 0), parent=None):
    r = empty(name, loc, parent=parent, coll=coll, rot=rot)
    r.scale = (s,) * 3
    cyl(name + "_b", 0.5, 1.7, (0, 0, 0), M("bat_body", "#2d9a4a", 0.3), 20, bev=0.04, parent=r, coll=coll)
    cyl(name + "_top", 0.5, 0.5, (0, 0, 0.95), M("bat_gold", "#e8b23a", 0.25, metal=1), 20, parent=r, coll=coll)
    cyl(name + "_tip", 0.22, 0.2, (0, 0, 1.3), M("bat_gold", "#e8b23a", 0.25, metal=1), 12, parent=r, coll=coll)
    return r


def remote(name, loc, s=1.0, coll=None, rot=(0, 0, 0), parent=None):
    r = empty(name, loc, parent=parent, coll=coll, rot=rot)
    r.scale = (s,) * 3
    box(name + "_b", (1.2, 0.5, 2.6), (0, 0, 0), M("rem_body", "#2a2a30", 0.4), 0.1, parent=r, coll=coll)
    for k in range(3):
        box(f"{name}_k{k}", (0.8, 0.12, 0.4), (0, -0.28, 0.4 - k * 0.6), M("rem_key", ["#d9453a", "#4a90d9", "#f2c14e"][k], 0.4),
            0.04, parent=r, coll=coll)
    return r


def balloon(name, loc, s=1.0, coll=None, color="#e83a4a"):
    r = empty(name, loc, coll=coll)
    r.scale = (s,) * 3
    sphere(name + "_b", 1.3, (0, 0, 0), M("balloon_" + color, color, 0.15), (1, 1, 1.2), parent=r, coll=coll)
    sphere(name + "_hl", 0.3, (-0.5, -1.0, 0.7), M("balloon_hl", "#ffffff", 0.3, emit=(1, 1, 1), estr=0.8), parent=r, coll=coll)
    cyl(name + "_knot", 0.2, 0.3, (0, 0, -1.65), M("balloon_" + color, color, 0.15), 8, parent=r, coll=coll, r2=0.05)
    cyl(name + "_str", 0.03, 5.0, (0, 0, -4.2), M("balloon_str", "#f4f4f4", 0.5), 6, parent=r, coll=coll)
    return r


def garage_door(name, loc, w=9.0, h=7.0, coll=None, color="#d8c49a", facing_y=-1):
    r = empty(name, loc, coll=coll)
    box(name + "_slab", (w, 0.5, h), (0, 0, h / 2), M("beige_door", color, 0.85), 0.05, parent=r, coll=coll)
    for k in range(1, 4):
        box(f"{name}_g{k}", (w, 0.12, 0.14), (0, -0.28, k * h / 4), M("beige_groove", "#b8a47a", 0.9), 0.0, parent=r, coll=coll)
    for k in range(4):
        box(f"{name}_win{k}", (1.5, 0.1, 0.7), (-3.0 + k * 2.0, -0.28, h * 0.8), M("gar_win", "#6a8aa8", 0.2), 0.02, parent=r, coll=coll)
    box(name + "_frame_l", (0.5, 0.7, h), (-w / 2 - 0.25, 0, h / 2), M("gar_frame", "#f4f4f4", 0.5), 0.02, parent=r, coll=coll)
    box(name + "_frame_r", (0.5, 0.7, h), (w / 2 + 0.25, 0, h / 2), M("gar_frame", "#f4f4f4", 0.5), 0.02, parent=r, coll=coll)
    box(name + "_frame_t", (w + 1.0, 0.7, 0.5), (0, 0, h + 0.25), M("gar_frame", "#f4f4f4", 0.5), 0.02, parent=r, coll=coll)
    return r


def candy(name, loc, coll=None, seed=0):
    rnd = random.Random(seed)
    c = sphere(name, 0.28, loc, M("candy" + str(seed % 4), ["#e83a7a", "#3ab8e8", "#f2c14e", "#5ad06a"][seed % 4], 0.3),
               coll=coll, seg=10)
    return c


def stanchion(name, loc, coll=None):
    r = empty(name, loc, coll=coll)
    cyl(name + "_base", 0.7, 0.2, (0, 0, 0.1), M("stan_gold", "#e2b23a", 0.2, metal=1), 16, parent=r, coll=coll)
    cyl(name + "_post", 0.16, 3.3, (0, 0, 1.8), M("stan_gold", "#e2b23a", 0.2, metal=1), 10, parent=r, coll=coll)
    sphere(name + "_top", 0.28, (0, 0, 3.55), M("stan_gold", "#e2b23a", 0.2, metal=1), parent=r, coll=coll)
    return r


def velvet_rope(name, p0, p1, coll=None):
    a, b = Vector(p0), Vector(p1)
    mid = (a + b) / 2
    ln = (b - a).length
    ang = math.atan2(b.y - a.y, b.x - a.x)
    return box(name, (ln, 0.22, 0.22), (mid.x, mid.y, 3.0), M("velvet", "#b01c2e", 0.7), 0.08, rot=(0, 0, math.degrees(ang)),
               coll=coll)


def ice_burst(name, loc, t, r=70.0, dur=0.55):
    """Expanding translucent cyan shell (time-freeze shockwave)."""
    m = mat("ice_shell", (0.7, 0.9, 1.0), 0.3, emit=(0.6, 0.85, 1.0), estr=2.5, alpha=0.35)
    s = sphere(name, 1.0, loc, m, seg=24)
    s.scale = (0.01,) * 3
    s.keyframe_insert("scale", frame=max(1, F(t) - 1))
    s.scale = (r,) * 3
    s.keyframe_insert("scale", frame=F(t + dur))
    s.scale = (0.001,) * 3
    s.keyframe_insert("scale", frame=F(t + dur) + 1)
    set_interp(s, "scale", F(t), "BEZIER", "EASE_OUT")
    return s


def frost_motes(center, spread=(18, 10, 8), n=40, seed=3):
    rnd = random.Random(seed)
    Ms = mat("frost_mote", (0.85, 0.95, 1.0), 0.3, emit=(0.7, 0.9, 1.0), estr=3.0)
    for i in range(n):
        p = (center[0] + rnd.uniform(-spread[0], spread[0]), center[1] + rnd.uniform(-spread[1], spread[1]),
             center[2] + rnd.uniform(0, spread[2]))
        sphere(f"mote{i}", rnd.uniform(0.05, 0.14), p, Ms, seg=6)


def chill(target, e=1500):
    """Cold fill light for 'time is frozen' shots."""
    light("chill", "AREA", (target[0] + 6, target[1] - 10, target[2] + 8), e, (0.55, 0.8, 1.0), 8, target=target)


def tint(strength=0.0, t0=None, t1=None):
    pass


# ================================================================== sets
def bank(open_door_t=None, frozen=False):
    c = collection("BANK")
    world((0.85, 0.9, 1.0), 0.5)
    box("bk_floor", (70, 60, 0.4), (0, 0, -0.2), checker_mat("bk_floor", "#f4efe2", "#8fa6c0", 0.25), 0, coll=c)
    Mw = M("bk_wall", "#efe3c6", 0.85)
    box("bk_back_l", (36, 0.5, 16), (-12, 12.25, 8), Mw, 0, coll=c)
    box("bk_back_r", (30, 0.5, 16), (25, 12.25, 8), Mw, 0, coll=c)
    box("bk_lintel", (4.2, 0.5, 8), (8, 12.25, 12), Mw, 0, coll=c)
    box("bk_void", (6, 6, 8), (8, 15.5, 4), M("bk_dark", "#0a0a10", 1.0), 0, coll=c)
    box("bk_left", (0.5, 60, 16), (-30.25, 0, 8), Mw, 0, coll=c)
    box("bk_trim", (80, 0.6, 1.2), (0, 11.9, 5.4), M("bk_trim", "#8a6a3a", 0.5), 0.05, coll=c)
    # door (hinge at x=6): swings toward camera
    hinge = empty("bk_hinge", (6.0, 11.7, 0), coll=c)
    box("bk_door", (4.0, 0.35, 8), (2.0, 0, 4), M("bk_door", "#6a4a2a", 0.5), 0.05, parent=hinge, coll=c)
    box("bk_doorglass", (2.4, 0.4, 4), (2.0, 0, 5.2), M("bk_dg", "#9ac8e8", 0.1, emit=(0.5, 0.7, 0.9), estr=0.4), 0.02, parent=hinge, coll=c)
    if open_door_t is not None:
        hinge.rotation_euler = (0, 0, 0)
        hinge.keyframe_insert("rotation_euler", frame=max(1, F(open_door_t) - 1))
        hinge.rotation_euler = (0, 0, math.radians(-105))
        hinge.keyframe_insert("rotation_euler", frame=F(open_door_t + 0.18))
        set_interp(hinge, "rotation_euler", F(open_door_t), "BEZIER", "EASE_OUT")
    # teller counter
    box("bk_counter", (22, 2.6, 3.8), (-14, 9.0, 1.9), M("bk_ctr", "#5a3a22", 0.5), 0.08, coll=c)
    box("bk_ctop", (22.4, 3.0, 0.3), (-14, 9.0, 3.95), M("bk_ctop", "#e8e8ea", 0.25), 0.04, coll=c)
    for k in range(3):
        box(f"bk_glass{k}", (4.4, 0.15, 3.4), (-20 + k * 6.0, 8.0, 5.8), M("bk_glassm", "#bfe0f4", 0.05, alpha=0.3), 0.0, coll=c)
        box(f"bk_gframe{k}", (4.6, 0.2, 0.2), (-20 + k * 6.0, 8.0, 7.6), M("bk_gf", "#e2b23a", 0.3, metal=1), 0.0, coll=c)
    label("bk_sign", "BANK", (-14, 11.5, 12.5), 2.8, "#f2c14e", estr=1.0)
    label("bk_sign2", "$", (22, 11.5, 8.5), 3.2, "#2d9a4a", estr=0.6)
    for k, x in enumerate((-24, 14)):
        box(f"bk_plant_p{k}", (1.6, 1.6, 1.4), (x, 9.5, 0.7), M("bk_pot", "#b0603a", 0.6), 0.1, coll=c)
        sphere(f"bk_plant{k}", 1.6, (x, 9.5, 2.8), M("bk_leaf", "#3a9a4a", 0.7), (1, 1, 1.2), coll=c)
    light("bk_key", "AREA", (0, -8, 14), 6500, (1.0, 0.97, 0.9), 14, coll=c, target=(0, 4, 2))
    light("bk_fill", "AREA", (-12, -4, 7), 1600, (0.9, 0.95, 1.0), 8, coll=c, target=(0, 4, 3))
    return c, hinge


def stage_bank_customers(t0, t1, ids=(0, 1, 2, 3, 4), frozen=False, scared=True):
    ks = []
    spots = [(-14, 3), (-18, -1), (14, 2), (18, -2), (10, 6), (-6, 6)]
    for n, i in enumerate(ids):
        K = townie(i, t0, t1, "scared" if scared else "neutral")
        x, y = spots[n % len(spots)]
        K.pose(t0, loc=(x, y, 0), rot=random.choice([0, 20, -20]))
        if scared:
            K.act(t0, "hands_head", 1.0, expr="scream")
        ks.append(K)
    return ks


def street():
    town_day()


def meeting_room():
    """Boring dad meeting: long table, whiteboard, grey walls."""
    c = collection("MEET")
    world((0.8, 0.82, 0.88), 0.45)
    box("mt_floor", (50, 40, 0.4), (0, 0, -0.2), M("mt_carpet", "#6a7280", 0.95), 0, coll=c)
    Mw = M("mt_wall", "#b9bec8", 0.9)
    box("mt_back", (50, 0.5, 14), (0, 10.25, 7), Mw, 0, coll=c)
    box("mt_left", (0.5, 40, 14), (-16.25, 0, 7), Mw, 0, coll=c)
    box("mt_table", (18, 5, 0.4), (0, 4, 3.4), wood("mt_wood", "#7a5a3a", "#8c6a46", 2.0), 0.05, coll=c)
    for sx in (-1, 1):
        box(f"mt_tleg{sx}", (0.5, 4, 3.3), (sx * 8, 4, 1.65), M("mt_leg", "#4a3a2a", 0.6), 0.03, coll=c)
    box("mt_board", (9, 0.2, 5), (0, 9.8, 7.5), M("mt_board", "#f4f6f8", 0.3), 0.05, coll=c)
    label("mt_title", "MEETING", (0, 9.6, 9.4), 0.9, "#2a2a30", extrude=0.02)
    label("mt_sub", "(zzz)", (0, 9.6, 7.6), 0.7, "#6a7280", extrude=0.02)
    light("mt_key", "AREA", (0, -8, 12), 5000, (0.95, 0.97, 1.0), 12, coll=c, target=(0, 4, 3))
    return c


def dad_meeting_cast(t0, t1):
    ds = []
    for k, x in enumerate((-7, -3.5, 0, 3.5, 7)):
        d = story._live(chars.Char(f"MDad{k}", skin=["#efd0b0", "#d9b48f", "#a8714a"][k % 3], shirt=["#5a7ab0", "#7a9a6a", "#a07a5a", "#8a6a9a", "#5a8a8a"][k],
                                   pants="#3a3f4a", hair=["short", "bald", "buzz", "short", "bald"][k], hair_color="#4a3020",
                                   face="mustache" if k % 2 == 0 else "plain", sleeves="long",
                                   extras=("glasses",) if k % 2 else ()), t0, t1, "bored")
        d.pose(t0, loc=(x, 6.6, 1.8), rot=180 if False else 0, hipz=-1.0, legL=(85, 3), legR=(85, -3))
        ds.append(d)
    return ds


# ================================================================== camera helpers
def cm(t0, t1, tgt, kind="push", d=9.0, yaw=0.0, pitch=6.0, lens=28, hand=1.0, roll=0.0):
    cam = Cam()
    if kind == "push":
        cam.push(t0, t1, tgt, d, d * 0.62, yaw=yaw, pitch=pitch, lens=lens, yaw1=yaw * 0.6)
    elif kind == "pull":
        cam.push(t0, t1, tgt, d * 0.62, d, yaw=yaw, pitch=pitch, lens=lens, yaw1=yaw * 1.2)
    elif kind == "orbit":
        cam.orbit(t0, t1, tgt, d, yaw - 22, yaw + 22, pitch=pitch, lens=lens)
    elif kind == "orbitr":
        cam.orbit(t0, t1, tgt, d, yaw + 22, yaw - 22, pitch=pitch, lens=lens)
    elif kind == "crane":
        cam.push(t0, t1, tgt, d, d * 0.8, yaw=yaw, pitch=pitch - 4, lens=lens, pitch1=pitch + 20)
    elif kind == "drop":
        cam.push(t0, t1, tgt, d, d * 0.8, yaw=yaw, pitch=pitch + 22, lens=lens, pitch1=pitch - 4)
    elif kind == "dutch":
        cam.push(t0, t1, tgt, d, d * 0.55, yaw=yaw, pitch=pitch, lens=lens, roll=roll or 9.0)
    elif kind == "zoom":
        cam.push(t0, t1, tgt, d, d, yaw=yaw, pitch=pitch, lens=lens, lens1=lens * 1.6)
    elif kind == "slide":
        cam.push(t0, t1, tgt, d, d, yaw=yaw - 18, pitch=pitch, lens=lens, yaw1=yaw + 18)
    if hand:
        cam.handheld(hand)
    return cam


def hit(cam, t, a=26, b=40, dur=0.09):
    cam.crash(t, a, b, dur)


def whipto(cam, t0, t1, p0, a0, p1, a1, lens=26):
    cam.whip(t0, t1, p0, a0, p1, a1, lens=lens)


def insert_fill():
    light("ins_fill", "AREA", (0, -12, 9), 7000, (1, 1, 1), 12, target=(0, 3, 4))


def family_kitchen():
    kitchen(False, True)
    for ob in list(bpy.data.objects):
        if ob.name.startswith(("kt_tabletop", "kt_tleg", "kt_chair", "kt_lamp")):
            bpy.data.objects.remove(ob, do_unlink=True)


def bigtext(body, loc, t, size=1.6, color="#ffffff", rot=(90, 0, 0), estr=1.5, dur=None, t_off=None):
    tx = label("bt_" + body[:6], body, loc, size, color, rot=rot, extrude=0.12, estr=estr)
    pop_in(tx, t, 1.0)
    if t_off:
        shrink_out(tx, t_off)
    return tx


# ================================================================== SHOT TABLE
FUNCS = []


def SH(a, desc=""):
    def deco(fn):
        FUNCS.append((a, fn, desc))
        return fn
    return deco


FREEZE_P = (0, -30, 0)


# ------------------------------------------------ 1  HOOK
@SH(0, "HOOK: bank frozen mid-robbery, dad lecturing in front")
def h01(t0, t1):
    bank()
    for i, x in enumerate((-9, 0, 9)):
        R = robber(i, t0, t1, "furious")
        P(R, t0, (x, 3.5, 0), 180 + 0 if False else 0)
        R.act(t0, "point", 1.0, expr="furious")
        blaster(R)
    D_ = dad(t0, t1, "talk")
    P(D_, t0, (0, -2, 0), 0)
    D_.act(t0 + 0.1, "point", 1.0)
    talk(D_, t0, t1)
    for k, x in enumerate((-14, 14)):
        K = townie(k, t0, t1, "scream"); P(K, t0, (x, 2, 0), 0); K.act(t0, "hands_head", 1.0, expr="scream")
    cam = cm(t0, t1, (0, 1, 4.2), "push", d=16, yaw=-14, pitch=5, lens=24, hand=2.0)
    hit(cam, t0 + 0.5, 24, 36)
    sfx(t0 + 0.02, "whoosh", 0.7)


@SH(4, "bank robbery: robber close, frozen mid-yell")
def h02(t0, t1):
    bank()
    R = robber(0, t0, t1, "furious"); P(R, t0, (0, 3, 0), -12); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
    R2 = robber(1, t0, t1, "furious"); P(R2, t0, (-5, 6, 0), 10); blaster(R2)
    cam = cm(t0, t1, (0, 3, 4.4), "dutch", d=8, yaw=14, pitch=2, lens=26, hand=2.0)
    sfx(t0, "whoosh", 0.6)


@SH(7, "talking about his garage: dad passionate")
def h03(t0, t1):
    family_kitchen()
    D_ = dad(t0, t1, "happy"); P(D_, t0, (0, 4, 0), 0); talk(D_, t0, t1)
    D_.act(t0 + 0.1, "point", 1.0, expr="happy")
    D_.act(t0 + 0.7, "hold", 1.0)
    cm(t0, t1, (0, 4, 4.4), "push", d=9, yaw=-10, pitch=4, lens=30, hand=1.2)


@SH(10, "garage: beige garage door pops")
def h04(t0, t1):
    street()
    garage_door("gd", (0, -24, 0), 9, 7)
    pop_in(bpy.data.objects["gd"], t0 + 0.05, 1.0)
    D_ = dad(t0, t1, "happy"); P(D_, t0, (-6.5, -31, 0), 20); D_.act(t0 + 0.1, "point_l", 1.0)
    cam = cm(t0, t1, (0, -26, 3.8), "push", d=22, yaw=10, pitch=6, lens=26, hand=1.5)
    sfx(t0 + 0.05, "pop")


@SH(12, "for 11 minutes: huge 11 MIN with spinning clock")
def h05(t0, t1):
    c = collection("CLK"); world((0.12, 0.14, 0.3), 0.9); insert_fill()
    box("clk_bg", (40, 0.4, 24), (0, 4, 8), M("clk_bgm", "#2a3a8a", 0.6), 0, coll=c)
    clock_face("bigclk", (0, 0, 6), t0, t1, 1.5, coll=c, turns=4)
    bigtext("11 MIN", (0, -0.6, 1.2), t0 + 0.15, 2.2, "#ffe070", t_off=None)
    light("clk_l", "AREA", (0, -10, 10), 3000, (1, 1, 1), 10, coll=c, target=(0, 0, 5))
    cam = cm(t0, t1, (0, 0, 4.2), "push", d=28, yaw=0, pitch=0, lens=30, hand=2.0)
    hit(cam, t0 + 0.15, 30, 42)
    sfx(t0 + 0.15, "ding", 0.7)
    sfx(t0 + 0.15, "u_applepay", 0.6)


# ------------------------------------------------ narrator setup
@SH(14, "You see, in this world: Sam talks to camera")
def n01(t0, t1):
    sam_room(False)
    E = kid_sam(t0, t1, "smug"); P(E, t0, (0, 2, 0), -6); talk(E, t0, t1); E.act(t0 + 0.1, "point", 1.0, expr="smug")
    cam = Cam(); cam.whip(t0, t0 + 0.14, (10, -9, 5), (7, 6, 4), orbit_pos((0, 2, 4.4), 7, -12, 4), (0, 2, 4.4), lens=26)
    cam.push(t0 + 0.14, t1, (0, 2, 4.4), 7, 5.2, yaw=-12, pitch=4, lens=28) if False else None
    cam.key(t1, orbit_pos((0, 2, 4.4), 5.2, 8, 3), (0, 2, 4.4), lens=30)
    cam.handheld(1.4)


@SH(19, "every dad can freeze time: street frozen, dad powerful")
def n02(t0, t1):
    street()
    D_ = dad(t0, t1, "smug"); P(D_, t0, FREEZE_P, 0); D_.act(t0 + 0.2, "point", 1.0, expr="smug")
    for k in range(4):
        K = townie(k, t0, t1, "neutral"); P(K, t0, (-14 + k * 9, -34 + (k % 2) * 3, 0), 20 * (k - 1))
    W.pigeon("fr_bird", (6, -30, 9))
    ice_burst("ice", (0, -30, 4), t0 + 1.6, 40, 0.5)
    chill((0, -30, 4))
    frost_motes((0, -30, 0), (14, 6, 9), 30)
    cam = cm(t0, t1, (0, -30, 4.4), "orbit", d=13, yaw=0, pitch=7, lens=26, hand=1.2)
    sfx(t0 + 1.6, "u_explosion", 0.5)
    sfx(t0 + 1.6, "whoosh", 0.7)


@SH(24, "but only while he's telling a boring story: dad droning, kid bored")
def n03(t0, t1):
    family_kitchen()
    D_ = dad(t0, t1, "bored"); P(D_, t0, (-1.4, 4, 0), 25); talk(D_, t0, t1)
    E = kid_sam(t0, t1, "bored"); P(E, t0, (1.6, 3, 0), -25); E.act(t0, "slump", 1.0, expr="bored")
    cm(t0, t1, (0, 3, 4.2), "slide", d=13, yaw=0, pitch=3, lens=26, hand=1.0)
    sfx(t0 + 0.5, "crickets", 0.5)


@SH(32, "the moment the story gets interesting: dad lights up")
def n04(t0, t1):
    family_kitchen()
    D_ = dad(t0, t1, "grin"); P(D_, t0, (0, 4, 0), 0); talk(D_, t0, t1)
    D_.act(t0 + 0.2, "cheer", 1.0, expr="joy")
    for k in range(6):
        a = k / 6 * math.tau
        sphere(f"spk{k}", 0.2, (math.cos(a) * 2.5, 3, 5 + math.sin(a) * 2.5),
               M("spk", "#fff4a0", 0.3, emit=(1, 0.95, 0.5), estr=6), seg=8)
    cam = cm(t0, t1, (0, 4, 4.6), "push", d=10, yaw=-8, pitch=2, lens=26, hand=1.6)
    hit(cam, t0 + 0.6, 26, 36)
    sfx(t0 + 0.5, "rise", 0.7)


@SH(38, "click!: dad snaps, white flash, text CLICK")
def n05(t0, t1):
    street()
    D_ = dad(t0, t1, "smug"); P(D_, t0, FREEZE_P, 0); D_.act(t0 + 0.05, "point", 1.0, expr="smug")
    bigtext("CLICK!", (0, -37, 8), t0 + 0.1, 3.0, "#ffe070")
    flash(t0 + 0.08, 2.6, 0.35)
    cam = cm(t0, t1, (0, -30, 4.6), "dutch", d=11, yaw=-6, pitch=3, lens=26, hand=2.0)
    hit(cam, t0 + 0.08, 26, 40)
    sfx(t0 + 0.08, "u_click", 1.0)
    sfx(t0 + 0.08, "click", 0.8)


@SH(39, "time starts again: street unfreezes, birds fly")
def n06(t0, t1):
    street()
    for k in range(4):
        K = townie(k, t0, t1, "happy"); P(K, t0, (-14 + k * 9, -34 + (k % 2) * 3, 0), 0)
        K.walk(t0 + 0.3, t1, (-14 + k * 9, -34, 0), (-14 + k * 9 + (6 if k % 2 else -6), -34, 0))
    for k in range(3):
        b = W.pigeon(f"bd{k}", (-8 + k * 8, -30, 8))
        keyloc(b, t0, (-8 + k * 8, -30, 8), "LINEAR"); keyloc(b, t1, (-8 + k * 8 + 8, -34, 16), "LINEAR")
    cm(t0, t1, (0, -32, 4.4), "pull", d=12, yaw=8, pitch=6, lens=24, hand=1.5)
    sfx(t0 + 0.1, "pigeon", 0.6); sfx(t0 + 0.2, "whoosh", 0.5)


# ------------------------------------------------ dad training
@SH(42, "So every dad has trained for years: dad with notebook, stack of boring books")
def t01(t0, t1):
    family_kitchen()
    D_ = dad(t0, t1, "determined"); P(D_, t0, (0, 4, 0), 0); talk(D_, t0, t1)
    for k in range(5):
        box(f"bk{k}", (3, 2.2, 0.5), (6, 3, 0.25 + k * 0.5), M("book" + str(k), ["#8a3a3a", "#3a6a8a", "#6a8a3a", "#8a6a3a", "#5a3a8a"][k], 0.6), 0.04, rot=(0, 0, k * 8))
    label("bkt", "STORIES", (6, 1.8, 3.2), 0.5, "#ffffff", rot=(90, 0, 0), extrude=0.02)
    cm(t0, t1, (2, 4, 3.6), "orbit", d=13, yaw=-8, pitch=8, lens=26, hand=1.2)
    sfx(t0 + 0.5, "paper", 0.7)


@SH(49, "stories about parking spots: parking lot + P sign")
def t02(t0, t1):
    street()
    W2.parking_lot((0, -30))
    D_ = dad(t0, t1, "happy"); P(D_, t0, (0, -40, 0), 0); talk(D_, t0, t1); D_.act(t0 + 0.1, "point", 1.0)
    label("park_sign", "P", (6, -42, 6), 3.0, "#3a7ad0", estr=1.0)
    cam = cm(t0, t1, (0, -38, 3.6), "slide", d=14, yaw=-6, pitch=8, lens=26, hand=1.2)
    sfx(t0 + 0.3, "u_duck", 0.5)


@SH(55, "about lawn fertilizer: bag with label")
def t03(t0, t1):
    c = collection("LAWN"); world((0.8, 0.9, 1.0), 0.6)
    box("lw_g", (80, 60, 0.4), (0, 0, -0.2), M("lw_grass", "#5fb04a", 0.9), 0, coll=c)
    box("lw_bag", (3.6, 1.8, 5.0), (0, 4, 2.5), M("lw_bagm", "#e8e0c0", 0.7), 0.3, coll=c)
    label("lw_t", "FERTILIZER", (0, 3.0, 3.4), 0.55, "#2d6a3a", rot=(90, 0, 0), extrude=0.02)
    label("lw_t2", "LAWN", (0, 3.0, 2.2), 0.7, "#c8261e", rot=(90, 0, 0), extrude=0.02)
    D_ = dad(t0, t1, "grin"); P(D_, t0, (-2.4, 0, 0), 20); talk(D_, t0, t1); D_.act(t0 + 0.2, "point", 1.0)
    light("lw_k", "AREA", (0, -10, 12), 6000, (1, 0.98, 0.9), 12, coll=c, target=(0, 2, 3))
    cm(t0, t1, (-0.5, 2, 3.6), "push", d=17, yaw=10, pitch=5, lens=26, hand=1.2)


@SH(58, "About the time: dad hand on chin")
def t04(t0, t1):
    family_kitchen()
    D_ = dad(t0, t1, "smug"); P(D_, t0, (0, 4, 0), 0); D_.act(t0 + 0.05, "think", 1.0, expr="smug")
    cm(t0, t1, (0, 4, 4.6), "push", d=8, yaw=-14, pitch=3, lens=34, hand=1.0)


@SH(61, "a different road was closed: ROAD CLOSED barrier")
def t05(t0, t1):
    street()
    c = collection("RD")
    for k in range(3):
        box(f"rb{k}", (4.5, 0.4, 1.4), (-5 + k * 5, -26, 3.2), M("rb_w", "#f4f4f4", 0.5), 0.05, coll=c)
        box(f"rbs{k}", (1.2, 0.42, 1.5), (-6.8 + k * 5, -26, 3.2), M("rb_o", "#f08a2a", 0.5), 0.02, coll=c)
        box(f"rbl{k}", (0.3, 0.3, 3.2), (-6.5 + k * 5, -26, 1.6), M("rb_l", "#d0d0d0", 0.5), 0.02, coll=c)
    label("rc_t", "ROAD CLOSED", (0, -26.4, 6.2), 0.8, "#d9453a", extrude=0.05, estr=0.3)
    D_ = dad(t0, t1, "happy"); P(D_, t0, (3.5, -32, 0), -30); talk(D_, t0, t1); D_.act(t0 + 0.2, "point_l", 1.0)
    cam = cm(t0, t1, (0, -28, 3.6), "push", d=16, yaw=12, pitch=6, lens=26, hand=1.5)
    sfx(t0 + 0.2, "u_discord", 0.5)


@SH(66, "Dad meetings: five bored dads at a table, crickets")
def t06(t0, t1):
    meeting_room()
    ds = dad_meeting_cast(t0, t1)
    for d in ds:
        d.act(t0, "slump", 1.0, expr="bored")
    cm(t0, t1, (0, 5, 4.2), "slide", d=15, yaw=0, pitch=7, lens=26, hand=0.8)
    sfx(t0 + 0.4, "crickets", 0.8)


@SH(71, "whole world frozen solid: crane over frozen street")
def t07(t0, t1):
    street()
    for k in range(7):
        K = townie(k, t0, t1, "bored"); P(K, t0, (-24 + k * 8, -34 + (k % 3) * 4, 0), 20 * (k % 3 - 1))
    W.pigeon("fb1", (-4, -30, 12)); W.pigeon("fb2", (10, -28, 14))
    chill((0, -32, 5), 2500)
    frost_motes((0, -32, 0), (26, 8, 12), 60)
    cm(t0, t1, (0, -32, 4), "crane", d=22, yaw=10, pitch=8, lens=22, hand=0.4)
    sfx(t0 + 0.3, "wind", 0.8)


# ------------------------------------------------ champion
@SH(81, "And my dad, he's the best in the country: podium, spotlight")
def c01(t0, t1):
    c = collection("PODIUM"); world((0.05, 0.05, 0.12), 0.9); insert_fill()
    box("pd_floor", (60, 40, 0.4), (0, 0, -0.2), M("pd_fl", "#2a2a38", 0.4), 0, coll=c)
    box("pd_podium", (6, 4, 3), (0, 4, 1.5), M("pd_p", "#d9453a", 0.5), 0.1, coll=c)
    label("pd_1", "1", (0, 1.98, 1.5), 1.8, "#ffe070", extrude=0.05, estr=0.8)
    D_ = dad(t0, t1, "grin"); P(D_, t0, (0, 4, 3.0), 0); D_.act(t0 + 0.2, "cheer", 1.0, expr="joy")
    light("pd_spot", "SPOT", (0, -8, 18), 90000, (1, 0.95, 0.8), 0.2, coll=c, target=(0, 4, 5), spot=26) if False else light("pd_spot", "AREA", (0, -6, 14), 9000, (1, 0.95, 0.8), 6, coll=c, target=(0, 4, 5))
    cam = cm(t0, t1, (0, 4, 5.8), "crane", d=12, yaw=0, pitch=2, lens=26, hand=1.0)
    sfx(t0 + 0.2, "cheer", 0.7)


@SH(90, "Boring champion: trophy spin")
def c02(t0, t1):
    c = collection("TR"); world((0.1, 0.1, 0.2), 0.9); insert_fill()
    box("tr_f", (40, 30, 0.4), (0, 0, -0.2), M("tr_fl", "#2a2a38", 0.3), 0, coll=c)
    tr = trophy("trp", (0, 3, 0), 1.6, coll=c)
    tr.rotation_euler = (0, 0, 0); tr.keyframe_insert("rotation_euler", frame=F(t0))
    tr.rotation_euler = (0, 0, math.radians(360)); tr.keyframe_insert("rotation_euler", frame=F(t1))
    set_interp(tr, "rotation_euler", F(t0), "LINEAR")
    label("tr_t", "BORING", (0, 1.4, 3.0), 0.55, "#2a1a10", rot=(90, 0, 0), extrude=0.02)
    light("tr_l", "AREA", (4, -8, 12), 6000, (1, 0.95, 0.8), 6, coll=c, target=(0, 3, 4))
    cam = cm(t0, t1, (0, 3, 5.0), "push", d=14, yaw=0, pitch=6, lens=34, hand=1.0)
    hit(cam, t0 + 0.05, 30, 40)
    sfx(t0 + 0.05, "ding", 0.8); sfx(t0 + 0.05, "sparkle", 0.6)


@SH(92, "three years in a row: three trophies, dolly")
def c03(t0, t1):
    c = collection("TR3"); world((0.1, 0.1, 0.2), 0.9); insert_fill()
    box("tr_f", (60, 30, 0.4), (0, 0, -0.2), M("tr_fl", "#2a2a38", 0.3), 0, coll=c)
    for k in range(3):
        tr = trophy(f"trp{k}", (-6 + k * 6, 3, 0), 1.4, coll=c)
        pop_in(tr, t0 + 0.15 + k * 0.45, 1.4)
        sfx(t0 + 0.15 + k * 0.45, "pop", 0.8)
    for k, y in enumerate(("2023", "2024", "2025")):
        label(f"yr{k}", y, (-6 + k * 6, 1.5, 0.9), 0.55, "#f2f2f2", rot=(90, 0, 0), extrude=0.02)
    light("tr_l", "AREA", (0, -8, 12), 7000, (1, 0.95, 0.8), 8, coll=c, target=(0, 3, 4))
    cm(t0, t1, (0, 3, 3.6), "slide", d=26, yaw=0, pitch=4, lens=28, hand=1.0)


@SH(97, "His record is: scoreboard RECORD")
def c04(t0, t1):
    c = collection("REC"); world((0.1, 0.12, 0.25), 0.9); insert_fill()
    box("rc_bg", (40, 0.4, 24), (0, 6, 8), M("rc_bgm", "#1a2a6a", 0.6), 0, coll=c)
    label("rc_h", "RECORD", (0, 5.5, 8.5), 2.2, "#ffe070", estr=1.2)
    D_ = dad(t0, t1, "grin"); P(D_, t0, (0, 0, 0), 0); D_.act(t0 + 0.1, "point", 1.0, expr="grin")
    light("rc_l", "AREA", (0, -10, 10), 4000, (1, 1, 1), 10, coll=c, target=(0, 2, 5))
    cm(t0, t1, (0, 2, 5.0), "push", d=14, yaw=-8, pitch=4, lens=26, hand=1.4)
    sfx(t0 + 0.1, "u_movie1", 0.5)


@SH(100, "four hours: clock 4 HOURS")
def c05(t0, t1):
    c = collection("4H"); world((0.12, 0.14, 0.3), 0.9); insert_fill()
    box("h_bg", (40, 0.4, 24), (0, 4, 8), M("h_bgm", "#6a2a8a", 0.6), 0, coll=c)
    clock_face("h_clk", (0, 0, 8.0), t0, t1, 1.0, coll=c, turns=4)
    label("h_t", "4", (-2.4, -0.2, 3.0), 3.2, "#ffe070", estr=1.4)
    label("h_t2", "HOURS", (1.2, -0.2, 3.0), 1.1, "#ffffff", estr=1.0)
    light("h_l", "AREA", (0, -10, 10), 3500, (1, 1, 1), 10, coll=c, target=(0, 0, 5))
    cam = cm(t0, t1, (0, 0, 5.5), "push", d=26, yaw=0, pitch=0, lens=28, hand=1.8)
    hit(cam, t0 + 0.2, 28, 40)
    sfx(t0 + 0.2, "u_108", 0.6)


@SH(102, "about a screwdriver: hero screwdriver glows")
def c06(t0, t1):
    c = collection("SD"); world((0.08, 0.08, 0.16), 0.9); insert_fill()
    box("sd_f", (40, 30, 0.4), (0, 0, -0.2), M("sd_fl", "#2a2a38", 0.3), 0, coll=c)
    sd = screwdriver("sdv", (0, 3, 4.5), 1.2, coll=c, rot=(0, 160, 0))
    sd.rotation_euler = (0, math.radians(90), math.radians(-25)); sd.keyframe_insert("rotation_euler", frame=F(t0))
    sd.rotation_euler = (0, math.radians(90), math.radians(25)); sd.keyframe_insert("rotation_euler", frame=F(t1))
    light("sd_l", "AREA", (3, -8, 10), 6000, (1, 0.95, 0.9), 6, coll=c, target=(0, 3, 4))
    light("sd_rim", "AREA", (-4, 10, 8), 3000, (0.6, 0.8, 1.0), 6, coll=c, target=(0, 3, 4))
    cam = cm(t0, t1, (0, 3, 4.5), "push", d=17, yaw=0, pitch=2, lens=34, hand=1.2)
    hit(cam, t0 + 0.2, 34, 46)
    sfx(t0 + 0.2, "ding", 0.6); sfx(t0 + 0.9, "u_quack", 0.4)


# ------------------------------------------------ family hates it
@SH(105, "Everyone in my family hates it: family on couch groaning")
def f01(t0, t1):
    living()
    Mm = mom(t0, t1, "bored"); P(Mm, t0, (-3.2, 6.2, 2.0), 0, hipz=-1.2, legL=(85, 3), legR=(85, -3))
    Mm.act(t0, "slump", 1.0, expr="sleepy")
    E = kid_sam(t0, t1, "angry"); P(E, t0, (0, 6.2, 2.0), 0, hipz=-1.2, legL=(85, 3), legR=(85, -3)); E.act(t0, "facepalm", 1.0, expr="furious")
    Mi = sis(t0, t1, "bored"); P(Mi, t0, (3.2, 6.2, 2.0), 0, hipz=-1.2, legL=(85, 3), legR=(85, -3)); Mi.act(t0, "slump", 1.0, expr="sleepy")
    cam = Cam(); cam.push(t0, t1, (0, 6, 4.4), 13, 9, yaw=-14, pitch=4, lens=24, yaw1=8); cam.handheld(1.4)
    sfx(t0 + 0.4, "u_dryfart", 0.5)


@SH(111, "Mom's eyes glaze over: Mom close, spiral eyes")
def f02(t0, t1):
    family_kitchen()
    Mm = mom(t0, t1, "bored"); P(Mm, t0, (0, 4, 0), 0)
    Mm.face(t0 + 0.3, "sleepy")
    cm(t0, t1, (0, 4, 4.7), "push", d=9, yaw=12, pitch=2, lens=36, hand=0.8)
    sfx(t0 + 0.3, "rise", 0.5)


@SH(115, "My sister once fell asleep: Mia drooping")
def f03(t0, t1):
    family_kitchen()
    Mi = sis(t0, t1, "bored"); P(Mi, t0, (0, 4, 0), 0)
    Mi.pose(t0 + 0.3, head=(0, 12, 0)); Mi.face(t0 + 0.4, "sleepy")
    cm(t0, t1, (0, 4, 3.6), "push", d=9, yaw=-12, pitch=4, lens=30, hand=1.0)
    sfx(t0 + 0.3, "u_duck", 0.4)


@SH(118, "standing up: Mia asleep on her feet, tilting, zzz")
def f04(t0, t1):
    family_kitchen()
    Mi = sis(t0, t1, "sleepy"); P(Mi, t0, (0, 4, 0), 0)
    Mi.face(t0, eyes="closed", mouth="wavy")
    Mi.root.rotation_euler[1] = 0
    Mi.root.keyframe_insert("rotation_euler", index=1, frame=F(t0))
    Mi.root.rotation_euler[1] = math.radians(9); Mi.root.keyframe_insert("rotation_euler", index=1, frame=F(t0 + 1.0))
    Mi.root.rotation_euler[1] = math.radians(-6); Mi.root.keyframe_insert("rotation_euler", index=1, frame=F(t1))
    for k in range(3):
        z = label(f"zz{k}", "Z", (1.4 + k * 0.7, 3.4, 5.4 + k * 0.8), 0.8 + k * 0.3, "#ffffff", extrude=0.04, estr=1.0)
        pop_in(z, t0 + 0.2 + k * 0.3, 1.0)
    cm(t0, t1, (0, 4, 3.2), "orbit", d=10, yaw=0, pitch=4, lens=28, hand=0.8)
    sfx(t0 + 0.2, "snort", 0.6)


@SH(122, "And me?: Sam points at himself, crash zoom")
def f05(t0, t1):
    sam_room(False)
    E = kid_sam(t0, t1, "gasp"); P(E, t0, (0, 2, 0), 0); E.act(t0 + 0.05, "point", 1.0, expr="gasp")
    E.pose(t0, armR=(100, 40))
    cam = cm(t0, t1, (0, 2, 4.4), "push", d=11, yaw=0, pitch=2, lens=24, hand=1.2)
    hit(cam, t0 + 0.15, 24, 38)
    sfx(t0 + 0.1, "whoosh", 0.6)


@SH(124, "I rolled my eyes so hard: extreme close, eyes roll")
def f06(t0, t1):
    sam_room(False)
    E = kid_sam(t0, t1, "bored"); P(E, t0, (0, 2, 0), 0)
    E.face(t0 + 0.1, eyes="up", mouth="flat"); E.face(t0 + 0.4, eyes="side_l", mouth="flat")
    E.face(t0 + 0.7, eyes="down", mouth="flat"); E.face(t0 + 1.0, eyes="side_r", mouth="flat")
    E.face(t0 + 1.3, eyes="up", mouth="grimace")
    cam = cm(t0, t1, (0, 2, 4.7), "push", d=8, yaw=6, pitch=1, lens=40, hand=1.0)
    sfx(t0 + 0.1, "u_slap", 0.0) if False else None
    sfx(t0 + 0.4, "boing", 0.5)


@SH(130, "I got a headache: hands on head, red pulse")
def f07(t0, t1):
    sam_room(False)
    E = kid_sam(t0, t1, "angry"); P(E, t0, (0, 2, 0), 0); E.act(t0 + 0.05, "hands_head", 1.0, expr="scream")
    for k in range(3):
        sphere(f"pain{k}", 0.35, (-1.6 + k * 1.6, 1.0, 6.4), M("pain", "#e83a3a", 0.3, emit=(1, 0.2, 0.2), estr=6), seg=8)
    flash(t0 + 0.1, 1.4, 0.2)
    cam = cm(t0, t1, (0, 2, 4.6), "dutch", d=8, yaw=0, pitch=2, lens=28, hand=2.5, roll=-8)
    hit(cam, t0 + 0.1, 28, 40)
    sfx(t0 + 0.1, "bonk", 0.8); sfx(t0 + 0.3, "u_faaah", 0.5)


@SH(134, "Dad, please stop: Sam begging")
def f08(t0, t1):
    family_kitchen()
    E = kid_sam(t0, t1, "cry"); P(E, t0, (0, 4, 0), 0); E.act(t0 + 0.1, "hands_face", 1.0, expr="cry")
    D_ = dad(t0, t1, "happy"); P(D_, t0, (6, 3, 0), -30); talk(D_, t0, t1)
    cam = cm(t0, t1, (0, 4, 4.4), "push", d=10, yaw=-6, pitch=3, lens=30, hand=1.4)
    hit(cam, t0 + 0.5, 30, 38)


@SH(137, "Well kiddo: dad turns to camera, smug")
def f09(t0, t1):
    family_kitchen()
    D_ = dad(t0, t1, "smug"); P(D_, t0, (0, 4, 0), -35); D_.pose(t0 + 0.3, rot=0); talk(D_, t0, t1)
    D_.act(t0 + 0.3, "hold", 1.0, expr="smug")
    cm(t0, t1, (0, 4, 4.6), "push", d=9, yaw=-16, pitch=2, lens=32, hand=1.0)
    sfx(t0 + 0.1, "u_rizz", 0.5)


@SH(139, "it all started in 1994: flashback, sepia 1994")
def f10(t0, t1):
    family_kitchen()
    D_ = dad(t0, t1, "smile"); P(D_, t0, (0, 4, 0), 0); D_.act(t0 + 0.1, "point", 1.0); talk(D_, t0, t1)
    bigtext("1994", (-4.5, 2.2, 8.0), t0 + 0.3, 1.9, "#ffe070")
    tint_sepia(t0, t1)
    cm(t0, t1, (0, 4, 5.0), "orbitr", d=11, yaw=0, pitch=5, lens=26, hand=1.0)
    sfx(t0 + 0.3, "u_movie1", 0.5)


def tint_sepia(t0, t1):
    c = collection("SEPIA")
    light("sepia_l", "AREA", (0, -8, 8), 2500, (1.0, 0.7, 0.35), 12, coll=c, target=(0, 4, 3))


@SH(144, "when I bought a garage door: dad with receipt & big door")
def f11(t0, t1):
    street()
    garage_door("gd", (0, -24, 0), 10, 7.5)
    D_ = dad(t0, t1, "grin"); P(D_, t0, (-2, -32, 0), 0); D_.act(t0 + 0.1, "cheer", 1.0, expr="joy")
    cam = cm(t0, t1, (0, -28, 4.0), "crane", d=19, yaw=-12, pitch=6, lens=26, hand=1.4)
    hit(cam, t0 + 1.1, 26, 36)
    sfx(t0 + 1.0, "cashier", 0.7)


# ------------------------------------------------ frozen at home
@SH(150, "Frozen.: ice burst, hard freeze")
def z01(t0, t1):
    family_kitchen()
    for who, loc in (("dad", (-4, 4, 0)), ("mom", (0, 6, 0)), ("sis", (4, 4, 0))):
        ch = {"dad": dad, "mom": mom, "sis": sis}[who](t0, t1, "bored")
        P(ch, t0, loc, 0)
    ice_burst("ice", (0, 3, 4), t0 + 0.05, 40, 0.55)
    chill((0, 4, 4)); frost_motes((0, 4, 0), (12, 5, 9), 30)
    flash(t0 + 0.05, 2.0, 0.3)
    cam = cm(t0, t1, (0, 4, 4.4), "dutch", d=14, yaw=0, pitch=4, lens=24, hand=0.3, roll=0)
    hit(cam, t0 + 0.05, 24, 36)
    sfx(t0 + 0.05, "u_explosion", 0.5); sfx(t0 + 0.05, "glitch", 0.6)


@SH(151, "Birds in the air: frozen pigeon mid-flap over window")
def z02(t0, t1):
    street()
    b = W.pigeon("fb", (0, -30, 7)); b.rotation_euler = (0, math.radians(-20), 0)
    for k in range(3):
        W.pigeon(f"fb{k}", (-10 + k * 9, -26 - k * 2, 9 + k))
    chill((0, -30, 6)); frost_motes((0, -30, 4), (10, 5, 8), 30)
    cm(t0, t1, (0, -30, 7), "orbit", d=9, yaw=0, pitch=2, lens=34, hand=0.3)
    sfx(t0 + 0.1, "pigeon", 0.5)


@SH(155, "Mom's coffee hanging in the air: mug + floating blob")
def z03(t0, t1):
    family_kitchen()
    Mm = mom(t0, t1, "gasp"); P(Mm, t0, (0, 4, 0), 0); Mm.act(t0, "hands_face", 1.0, expr="gasp")
    m = locs.mug("floatmug", None); m.location = (-2, 3, 6.2); m.rotation_euler = (math.radians(70), 0, 0)
    for k in range(7):
        sphere(f"cf{k}", 0.18 + (k % 3) * 0.05, (-2 + 0.35 * k - 1.0, 2.8, 6.2 + 0.6 * ((k * 5) % 4) / 2),
               M("coffee", "#4a2a14", 0.2), seg=10)
    chill((0, 4, 5)); frost_motes((0, 4, 0), (8, 4, 9), 24)
    cm(t0, t1, (-1, 3.4, 5.4), "push", d=10, yaw=10, pitch=3, lens=30, hand=0.4)
    sfx(t0 + 0.3, "sparkle", 0.6)


@SH(161, "Dad just kept going: dad droning on, oblivious")
def z04(t0, t1):
    family_kitchen()
    D_ = dad(t0, t1, "talk"); P(D_, t0, (0, 4, 0), 0); talk(D_, t0, t1); D_.act(t0 + 0.2, "point", 1.0)
    Mm = mom(t0, t1, "gasp"); P(Mm, t0, (6, 4, 0), -30)
    chill((0, 4, 4)); frost_motes((0, 4, 0), (10, 5, 9), 20)
    cm(t0, t1, (0, 4, 4.5), "pull", d=9, yaw=14, pitch=3, lens=28, hand=1.2)


# ------------------------------------------------ the bank
@SH(165, "But one Saturday: calendar + whip to bank exterior")
def b01(t0, t1):
    street()
    c = collection("BKEXT")
    box("bx_body", (22, 10, 14), (0, -20, 7), M("bx_wall", "#e8dcc0", 0.8), 0.1, coll=c)
    for k in range(4):
        box(f"bx_col{k}", (1.2, 1.2, 12), (-7.5 + k * 5, -25.2, 6), M("bx_c", "#f4f4f4", 0.4), 0.05, coll=c)
    box("bx_roof", (24, 12, 1.2), (0, -20, 14.4), M("bx_r", "#8a6a3a", 0.6), 0.05, coll=c)
    label("bx_t", "BANK", (0, -25.4, 12.4), 2.2, "#f2c14e", estr=1.0)
    label("sat", "SATURDAY", (0, -33, 17), 1.4, "#ffffff", estr=1.2)
    cam = cm(t0, t1, (0, -26, 7), "pull", d=20, yaw=10, pitch=10, lens=24, hand=1.6)
    sfx(t0 + 0.1, "whoosh", 0.6)


@SH(168, "we went to the bank: family walks to the door")
def b02(t0, t1):
    street()
    c = collection("BKEXT")
    box("bx_body", (22, 10, 14), (0, -20, 7), M("bx_wall", "#e8dcc0", 0.8), 0.1, coll=c)
    box("bx_door", (4, 0.4, 7), (0, -25.2, 3.5), M("bx_d", "#6a4a2a", 0.5), 0.05, coll=c)
    label("bx_t", "BANK", (0, -25.4, 11.4), 2.2, "#f2c14e", estr=1.0)
    for k, (f, x) in enumerate(((dad, -6), (mom, -3), (kid_sam, 0), (sis, 3))):
        ch = f(t0, t1, "smile")
        ch.walk(t0, t1, (x - 8, -42, 0), (x * 0.5, -30, 0), rate=2.8)
    cam = cm(t0, t1, (0, -32, 3.6), "slide", d=16, yaw=0, pitch=5, lens=26, hand=1.2)


@SH(173, "Suddenly,: calm bank, door about to burst")
def b03(t0, t1):
    bank(open_door_t=t1 - 0.1)
    for k, ch_ in enumerate((dad, mom, kid_sam)):
        ch = ch_(t0, t1, "neutral"); P(ch, t0, (-10 + k * 3, -2, 0), 20)
    stage_bank_customers(t0, t1, (3, 4), scared=False)
    cam = cm(t0, t1, (6, 8, 4), "push", d=17, yaw=-10, pitch=4, lens=24, hand=0.8)
    hit(cam, t1 - 0.2, 24, 34)
    sfx(t1 - 0.1, "door", 0.8)


@SH(174, "three masked robbers burst in: charging toward camera")
def b04(t0, t1):
    c, hinge = bank(open_door_t=t0 + 0.05)
    for i, x in enumerate((6, 8, 10)):
        R = robber(i, t0, t1, "furious"); blaster(R)
        R.walk(t0 + 0.05, t1, (x + (i - 1) * 0, 13.0, 0), (x - 12 + i * 7, 2 - i, 0), rate=3.6, swing=40, arm=30)
        R.act(t0 + 0.8, "point", 1.0, expr="furious")
    cam = Cam(); cam.push(t0, t1, (2, 6, 4), 18, 12, yaw=0, pitch=5, lens=22); cam.handheld(3.0)
    hit(cam, t0 + 0.3, 22, 30)
    sfx(t0 + 0.05, "door", 0.9); sfx(t0 + 0.3, "u_explosion", 0.3); sfx(t0 + 0.4, "stomp", 0.7)


@SH(179, "Everybody on the ground!: robber shouting closeup")
def b05(t0, t1):
    bank()
    R = robber(0, t0, t1, "shout"); P(R, t0, (0, 2, 0), 0); R.act(t0, "point", 1.0, expr="shout"); blaster(R); lips(R, t0, t1)
    cam = cm(t0, t1, (0, 2, 4.6), "dutch", d=7, yaw=8, pitch=-2, lens=26, hand=3.0, roll=8)
    hit(cam, t0 + 0.2, 26, 42)
    sfx(t0 + 0.2, "u_faaah", 0.35); sfx(t0 + 0.8, "stomp", 0.6)


@SH(183, "Guns up,: three robbers aim, low angle")
def b06(t0, t1):
    bank()
    for i, x in enumerate((-6, 0, 6)):
        R = robber(i, t0, t1, "angry"); P(R, t0, (x, 3, 0), -10 * (i - 1)); R.act(t0 + 0.1 + i * 0.1, "point", 1.0, expr="angry"); blaster(R)
    cm(t0, t1, (0, 3, 3.6), "pull", d=8, yaw=0, pitch=-4, lens=22, hand=2.5)
    sfx(t0 + 0.2, "click", 0.8)


@SH(185, "bags open,: robbers hold open sacks")
def b07(t0, t1):
    bank()
    for i, x in enumerate((-2.1, 2.1)):
        R = robber(i, t0, t1, "smug"); P(R, t0, (x, 3, 0), -10 + i * 20); R.act(t0, "hold", 1.0, expr="smug")
        sp = sphere(f"bag{i}", 1.1, (0, -1.0, -3.2), M("bag_m", "#6a4a2a", 0.7), (1, 0.8, 1.1), parent=R.shL, coll=R.coll)
        label(f"bagt{i}", "$", (x, 1.9, 3.6), 0.9, "#2d9a4a", extrude=0.04, estr=0.6)
    cm(t0, t1, (0, 3, 3.6), "slide", d=12, yaw=0, pitch=2, lens=26, hand=2.0)
    sfx(t0 + 0.2, "coin", 0.7)


@SH(187, "everyone screamed: customers scream, camera shakes")
def b08(t0, t1):
    bank()
    for k in range(6):
        K = townie(k, t0, t1, "scream"); P(K, t0, (-5 + k * 2, 1 + (k % 2) * 3, 0), 0)
        K.act(t0 + 0.05 * k, "hands_head", 1.0, expr="scream")
        K.pose(t0 + 0.4, loc=(-5 + k * 2, 1 + (k % 2) * 3, 0.0))
    for k in range(6):
        jump_ok = acting.jump(K, t0 + 0.3, 0.8) if False else None
    cm(t0, t1, (0, 3, 4.2), "push", d=14, yaw=0, pitch=4, lens=22, hand=4.0)
    sfx(t0 + 0.05, "gasp", 0.8); sfx(t0 + 0.2, "crowd", 0.6)


@SH(189, "My little sister was standing: Mia close with balloon")
def b09(t0, t1):
    bank()
    Mi = sis(t0, t1, "scared"); P(Mi, t0, (0, 0, 0), 0)
    balloon("bl", (2.3, 0, 8.0), 1.0).parent = Mi.root if False else None
    cm(t0, t1, (0.8, 0, 4.0), "push", d=9, yaw=-14, pitch=4, lens=30, hand=1.2)


@SH(193, "right in front of them: sister small, robbers loom behind")
def b10(t0, t1):
    bank()
    Mi = sis(t0, t1, "scared"); P(Mi, t0, (0, -4, 0), 180)
    balloon("bl", (1.8, -4.4, 7.8), 1.0)
    for i, x in enumerate((-6, 0, 6)):
        R = robber(i, t0, t1, "furious"); P(R, t0, (x, 5, 0), 0); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
    cam = Cam()
    cam.key(t0, (3, -14, 3.2), (0, 3, 4.2), lens=22)
    cam.key(t1, (1.0, -9, 3.8), (0, 3, 4.6), lens=24, ease="EASE_IN_OUT")
    cam.handheld(1.0)
    sfx(t0, "rise", 0.5)


@SH(199, "holding a balloon: balloon insert, red")
def b11(t0, t1):
    bank()
    bl = balloon("bl", (0, 0, 5.2), 1.3)
    bl.location = (0, 0, 5.0); bl.keyframe_insert("location", frame=F(t0))
    bl.location = (0.5, 0, 5.8); bl.keyframe_insert("location", frame=F(t1))
    cm(t0, t1, (0, 0, 5.3), "push", d=8, yaw=10, pitch=2, lens=34, hand=0.8)
    sfx(t0 + 0.05, "pop", 0.5)


@SH(202, "One robber pointed at her: arm out, pointing")
def b12(t0, t1):
    bank()
    R = robber(0, t0, t1, "shout"); P(R, t0, (0, 3, 0), 0); blaster(R)
    R.pose(t0, armR=(10, 0)); R.act(t0 + 0.25, "point", 1.0, expr="angry")
    cm(t0, t1, (0, 3, 4.2), "dutch", d=9, yaw=22, pitch=2, lens=26, hand=2.0, roll=6)
    sfx(t0 + 0.25, "whoosh", 0.5)


@SH(207, "You! Come here!: robber yells, crash")
def b13(t0, t1):
    bank()
    R = robber(0, t0, t1, "shout"); P(R, t0, (0, 2, 0), 0); R.act(t0, "point", 1.0, expr="shout"); blaster(R); lips(R, t0, t1)
    cam = cm(t0, t1, (0, 2, 4.8), "push", d=8, yaw=-6, pitch=-3, lens=24, hand=3.0)
    hit(cam, t0 + 0.05, 24, 44, 0.08)
    sfx(t0 + 0.05, "u_faaah", 0.4); sfx(t0 + 0.7, "stomp", 0.6)


@SH(210, "I looked at dad: Sam glances, whip to dad")
def b14(t0, t1):
    bank()
    E = kid_sam(t0, t1, "scared"); P(E, t0, (-7, 0, 0), 0); E.pose(t0 + 0.1, head=(25, 0, 0))
    D_ = dad(t0, t1, "terror"); P(D_, t0, (-12, 0, 0), 0)
    cam = Cam(); cam.key(t0, orbit_pos((-7, 0, 4.4), 6, -10, 3), (-7, 0, 4.4), lens=34)
    cam.key(t0 + 0.9, orbit_pos((-7, 0, 4.4), 6, -10, 3), (-7, 0, 4.4), lens=34)
    cam.key(t0 + 1.05, orbit_pos((-12, 0, 4.6), 7, -10, 3), (-12, 0, 4.6), lens=28, ease="EASE_IN_OUT")
    cam.key(t1, orbit_pos((-12, 0, 4.6), 5.5, -6, 3), (-12, 0, 4.6), lens=30)
    cam.handheld(1.2)
    sfx(t0 + 0.9, "whoosh", 0.7)


@SH(214, "He was shaking: dad shakes, sweat drops")
def b15(t0, t1):
    bank()
    D_ = dad(t0, t1, "terror"); P(D_, t0, (-2, 0, 0), 0)
    for k in range(4):
        d = sphere(f"sw{k}", 0.15, (0.9 + k * 0.15, -0.7, 6.2), M("sweat", "#9ad8ff", 0.2, emit=(0.4, 0.7, 1.0), estr=0.6), (0.8, 0.8, 1.2), seg=8)
        keyloc(d, t0 + 0.2 + k * 0.1, (0.9 + k * 0.15, -0.7, 6.2)); keyloc(d, t0 + 0.9 + k * 0.1, (1.3 + k * 0.1, -0.9, 3.4))
    for k in range(3):
        D_.pose(t0 + 0.1 + k * 0.2, head=(5, 0, 4), torso=(0, 0, 3)); D_.pose(t0 + 0.2 + k * 0.2, head=(-5, 0, -4), torso=(0, 0, -3))
    cm(t0, t1, (-2, 0, 4.7), "push", d=7, yaw=8, pitch=1, lens=40, hand=3.2)
    sfx(t0 + 0.1, "rimshot", 0.0) if False else sfx(t0 + 0.2, "sparkle", 0.0) if False else None
    sfx(t0 + 0.1, "buzzer", 0.25)


@SH(217, "And I whispered,: Sam leans in whispering")
def b16(t0, t1):
    bank()
    E = kid_sam(t0, t1, "worried"); P(E, t0, (0, 0, 0), 20); E.pose(t0 + 0.2, head=(-15, 5, 0)); lips(E, t0, t1)
    cm(t0, t1, (0, 0, 4.6), "push", d=8, yaw=-10, pitch=2, lens=38, hand=0.8)


@SH(220, "Dad, tell the garage story: two-shot, Sam pleading to dad")
def b17(t0, t1):
    bank()
    E = kid_sam(t0, t1, "worried"); P(E, t0, (-1.3, 0, 0), -30); lips(E, t0, t1)
    D_ = dad(t0, t1, "terror"); P(D_, t0, (1.4, 0, 0), 30)
    D_.pose(t0 + 0.8, head=(-10, 5, 0)); D_.face(t0 + 1.0, "worried")
    cam = cm(t0, t1, (0, 0, 4.4), "push", d=12, yaw=0, pitch=2, lens=28, hand=1.2)
    sfx(t0 + 1.4, "u_click", 0.4)


@SH(225, "He took a deep breath: dad inflates")
def b18(t0, t1):
    bank()
    D_ = dad(t0, t1, "determined"); P(D_, t0, (0, 0, 0), 0)
    D_.pose(t0 + 0.2, head=(0, -8, 0), armL=(5, 20), armR=(5, 20))
    D_.pose(t0 + 0.9, head=(0, 6, 0), armL=(5, 30), armR=(5, 30))
    D_.face(t0 + 0.2, "gasp"); D_.face(t0 + 0.9, "determined")
    cam = cm(t0, t1, (0, 0, 4.4), "push", d=9, yaw=0, pitch=0, lens=26, hand=0.6)
    hit(cam, t0 + 0.9, 26, 40)
    sfx(t0 + 0.2, "wind", 0.7); sfx(t0 + 0.8, "rise", 0.6)


@SH(230, "Well,: dad about to speak, eyes locked")
def b19(t0, t1):
    bank()
    D_ = dad(t0, t1, "determined"); P(D_, t0, (0, 0, 0), 0); D_.act(t0 + 0.1, "point", 1.0, expr="determined")
    cam = cm(t0, t1, (0, 0, 4.8), "dutch", d=7, yaw=0, pitch=0, lens=36, hand=1.0, roll=-6)
    hit(cam, t0 + 0.1, 36, 46)


@SH(231, "it all started in 1994: dad speaks, orbit")
def b20(t0, t1):
    bank()
    D_ = dad(t0, t1, "talk"); P(D_, t0, (0, 0, 0), 0); talk(D_, t0, t1); D_.act(t0 + 0.2, "cheer", 1.0, expr="happy")
    bigtext("1994", (0, -1.6, 8.8), t0 + 0.9, 1.8, "#ffe070")
    cm(t0, t1, (0, 0, 4.6), "orbit", d=9, yaw=0, pitch=4, lens=30, hand=1.2)
    sfx(t0 + 0.9, "pop", 0.7)


@SH(236, "FOOM!: freeze shockwave bursts through the bank")
def z10(t0, t1):
    bank()
    D_ = dad(t0, t1, "talk"); P(D_, t0, (0, 0, 0), 0)
    for i, x in enumerate((-8, 0, 8)):
        R = robber(i, t0, t1, "furious"); P(R, t0, (x, 5, 0), 0); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
    ice_burst("ice", (0, 0, 4), t0 + 0.05, 55, 0.6)
    flash(t0 + 0.05, 3.0, 0.4)
    bigtext("FOOM!", (0, -3, 7.5), t0 + 0.05, 3.0, "#a0e0ff")
    cam = cm(t0, t1, (0, 2, 4.4), "push", d=14, yaw=0, pitch=2, lens=22, hand=4.0)
    hit(cam, t0 + 0.05, 22, 40, 0.1)
    sfx(t0 + 0.05, "boom", 1.0); sfx(t0 + 0.05, "u_explosion", 0.6); sfx(t0 + 0.3, "glitch", 0.5)


@SH(237, "Silence!: totally still, cold light, wide")
def z11(t0, t1):
    bank()
    D_ = dad(t0, t1, "talk"); P(D_, t0, (0, 0, 0), 0); talk(D_, t0, t1)
    for i, x in enumerate((-8, 0, 8)):
        R = robber(i, t0, t1, "furious"); P(R, t0, (x, 5, 0), 0); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
    stage_bank_customers(t0, t1, (0, 1, 2, 3), scared=True)
    chill((0, 2, 4), 3000); frost_motes((0, 2, 0), (22, 8, 9), 70)
    cam = cm(t0, t1, (0, 2, 4.2), "crane", d=22, yaw=0, pitch=5, lens=22, hand=0.2)
    sfx(t0 + 0.1, "crickets", 0.9)


@SH(238, "The robbers froze mid-yell: robber frozen, mouth wide")
def z12(t0, t1):
    bank()
    R = robber(0, t0, t1, "shout"); P(R, t0, (0, 3, 0), 0); R.act(t0, "point", 1.0, expr="scream"); blaster(R)
    chill((0, 3, 4)); frost_motes((0, 3, 0), (8, 4, 7), 30)
    cam = cm(t0, t1, (0, 3, 4.6), "orbit", d=7, yaw=0, pitch=2, lens=38, hand=0.3)
    sfx(t0 + 0.2, "glitch", 0.5); sfx(t0 + 0.7, "u_dryfart", 0.45)


@SH(243, "The balloon froze mid-float: balloon hangs in air")
def z13(t0, t1):
    bank()
    bl = balloon("bl", (0, 0, 7.0), 1.4)
    for k in range(10):
        a = k / 10 * math.tau
        sphere(f"bm{k}", 0.08, (math.cos(a) * 2.4, 0, 7.0 + math.sin(a) * 2.4), M("bm", "#bfe8ff", 0.3, emit=(0.6, 0.85, 1.0), estr=3), seg=6)
    chill((0, 0, 6), 2500)
    cam = cm(t0, t1, (0, 0, 6.5), "orbit", d=9, yaw=0, pitch=6, lens=32, hand=0.2)
    sfx(t0 + 0.1, "sparkle", 0.7)


@SH(248, "Dad kept talking: oblivious dad, frozen robbers behind")
def z14(t0, t1):
    bank()
    D_ = dad(t0, t1, "happy"); P(D_, t0, (0, -2, 0), 0); talk(D_, t0, t1); D_.act(t0 + 0.1, "point", 1.0)
    for i, x in enumerate((-7, 0, 7)):
        R = robber(i, t0, t1, "furious"); P(R, t0, (x, 5, 0), 0); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
    chill((0, 2, 4)); frost_motes((0, 2, 0), (16, 8, 8), 40)
    cm(t0, t1, (0, 0, 4.4), "push", d=14, yaw=-14, pitch=3, lens=26, hand=0.8)


@SH(251, "And the door was beige: beige garage door, label pop")
def z15(t0, t1):
    street()
    garage_door("gd", (0, -24, 0), 10, 7.5)
    D_ = dad(t0, t1, "grin"); P(D_, t0, (3.5, -31, 0), -25); talk(D_, t0, t1); D_.act(t0 + 0.2, "point_l", 1.0)
    cam = cm(t0, t1, (0, -27, 3.8), "push", d=22, yaw=12, pitch=5, lens=26, hand=1.0)
    sfx(t0 + 0.4, "u_discord", 0.5)


@SH(256, "Not cream, not white: swatches")
def z16(t0, t1):
    c = collection("SW"); world((0.8, 0.8, 0.85), 0.6)
    box("sw_bg", (50, 0.4, 24), (0, 6, 7), M("sw_bgm", "#e8e8ee", 0.8), 0, coll=c)
    for k, (col, nm) in enumerate((("#f5ecd0", "CREAM"), ("#ffffff", "WHITE"))):
        b = box(f"sw{k}", (2.8, 0.3, 2.8), (-1.7 + k * 3.4, 4, 6), M("swm" + str(k), col, 0.7), 0.1, coll=c)
        label(f"swt{k}", nm, (-1.7 + k * 3.4, 3.6, 2.4), 0.6, "#3a3a44", extrude=0.02)
        pop_in(b, t0 + 0.05 + k * 0.45, 1.0)
        shrink_out(b, t0 + 0.05 + k * 0.45 + 0.6) if False else None
        sfx(t0 + 0.05 + k * 0.45, "u_click", 0.6)
        xx = label(f"swx{k}", "X", (-1.7 + k * 3.4, 3.55, 6.2), 3.0, "#d9453a", extrude=0.05, estr=0.5)
        pop_in(xx, t0 + 0.35 + k * 0.45, 1.0)
    light("sw_l", "AREA", (0, -10, 12), 4000, (1, 1, 1), 10, coll=c, target=(0, 4, 5))
    cm(t0, t1, (0, 4, 5.8), "slide", d=17, yaw=0, pitch=2, lens=28, hand=1.6)
    sfx(t0 + 0.05, "buzzer", 0.3)


@SH(260, "Beige.: BEIGE slam")
def z17(t0, t1):
    c = collection("BG"); world((0.7, 0.62, 0.45), 0.6)
    box("bg_bg", (60, 0.4, 30), (0, 6, 7), M("bg_bgm", "#d8c49a", 0.85), 0, coll=c)
    bigtext("BEIGE", (0, 3.5, 6.0), t0 + 0.05, 1.5, "#6a5230", estr=0.0)
    flash(t0 + 0.06, 1.0, 0.2)
    light("bg_l", "AREA", (0, -10, 12), 5000, (1, 0.95, 0.85), 10, coll=c, target=(0, 4, 5))
    cam = cm(t0, t1, (0, 3.5, 6.0), "push", d=20, yaw=0, pitch=0, lens=30, hand=2.5)
    hit(cam, t0 + 0.05, 30, 50)
    sfx(t0 + 0.05, "boom", 0.8); sfx(t0 + 0.05, "u_slap", 0.5)


@SH(261, "I ran, grabbed my sister: Sam sprints through frozen bank")
def z18(t0, t1):
    bank()
    Mi = sis(t0, t1, "scared"); P(Mi, t0, (6, 2, 0), 180)
    E = kid_sam(t0, t1, "determined"); E.pose(t0, loc=(-10, -6, 0), rot=-45); acting.run(E, t0, t1 - 0.2, (-10, -6, 0), (4.5, 1.2, 0), 4.0)
    for i, x in enumerate((-4, 8)):
        R = robber(i, t0, t1, "furious"); P(R, t0, (x, 8, 0), 0); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
    chill((0, 3, 4)); frost_motes((0, 3, 0), (20, 8, 8), 40)
    cam = Cam(); cam.track(E, t0, t1, (5, -6, 2.0), 3.6, 24, 0.15); cam.handheld(2.0)
    sfx(t0 + 0.05, "whoosh", 0.7); sfx(t0 + 0.1, "footsteps", 0.6)


@SH(266, "and pulled her away: Sam drags Mia, balloon stays")
def z19(t0, t1):
    bank()
    Mi = sis(t0, t1, "gasp"); P(Mi, t0, (0, 1, 0), 0); Mi.pose(t0 + 0.2, loc=(-6, -3, 0), rot=30)
    E = kid_sam(t0, t1, "determined"); P(E, t0, (1.8, 0.2, 0), 0); E.pose(t0 + 0.2, loc=(-4.2, -3.2, 0), rot=30, armR=(70, 20))
    balloon("bl", (0, 1, 7.4), 1.2)
    cam = cm(t0, t1, (-2, -1, 3.8), "slide", d=12, yaw=6, pitch=3, lens=26, hand=2.5)
    sfx(t0 + 0.1, "whoosh", 0.7)


@SH(270, "Mom tied the robbers up: Mom winding rope around robbers")
def z20(t0, t1):
    bank()
    R = robber(0, t0, t1, "scream"); P(R, t0, (0, 3, 0), 0); R.act(t0, "point", 1.0, expr="scream"); blaster(R)
    Mm = mom(t0, t1, "determined"); P(Mm, t0, (-2.4, 0, 0), 30); Mm.act(t0 + 0.1, "reach", 1.0, expr="determined")
    for k in range(3):
        r_ = cyl(f"rope{k}", 1.0, 0.25, (0, 3, 1.8 + k * 0.9), M("velvet", "#b01c2e", 0.7), 20)
        r_.scale = (0.01,) * 3; r_.keyframe_insert("scale", frame=F(t0 + 0.2 + k * 0.25))
        r_.scale = (1, 1, 1); r_.keyframe_insert("scale", frame=F(t0 + 0.4 + k * 0.25))
        sfx(t0 + 0.4 + k * 0.25, "rope", 0.7)
    chill((0, 3, 4))
    cm(t0, t1, (-1, 3, 3.6), "orbit", d=11, yaw=0, pitch=5, lens=28, hand=1.2)


@SH(275, "with the bank's velvet ropes: ropes + stanchions insert")
def z21(t0, t1):
    bank()
    for k in range(3):
        stanchion(f"st{k}", (-8 + k * 8, 0, 0))
    velvet_rope("vr0", (-8, 0, 3), (0, 0, 3)); velvet_rope("vr1", (0, 0, 3), (8, 0, 3))
    label("vr_t", "VELVET", (0, -0.6, 4.6), 0.7, "#b01c2e", extrude=0.03)
    cm(t0, t1, (0, 0, 3.2), "slide", d=10, yaw=0, pitch=4, lens=30, hand=1.5)
    sfx(t0 + 0.1, "place", 0.7)


@SH(280, "A security guard stuffed their pockets: guard with candy handful")
def z22(t0, t1):
    bank()
    G = guard(t0, t1, "grin"); P(G, t0, (0, 0, 0), 0); G.act(t0 + 0.1, "reach", 1.0, expr="grin")
    R = robber(0, t0, t1, "scream"); P(R, t0, (4.5, 1, 0), -40); R.act(t0, "point", 1.0, expr="scream")
    for k in range(6):
        c_ = candy(f"cd{k}", (-0.5, -0.9, 3.5), None, k)
        keyloc(c_, t0 + 0.3 + k * 0.1, (-0.5, -0.9, 3.5)); keyloc(c_, t0 + 0.8 + k * 0.1, (3.0 + (k % 3) * 0.3, 0.3, 2.0 + (k % 2)))
    chill((0, 1, 4), 800)
    cm(t0, t1, (2, 0, 3.4), "push", d=10, yaw=-14, pitch=4, lens=28, hand=1.2)
    sfx(t0 + 0.4, "pop", 0.6); sfx(t0 + 0.7, "coin", 0.4)


@SH(286, "with candy, just for fun: candy rain, robber pockets overflow")
def z23(t0, t1):
    bank()
    R = robber(0, t0, t1, "scream"); P(R, t0, (0, 3, 0), 0); R.act(t0, "point", 1.0, expr="scream"); blaster(R)
    for k in range(40):
        a = k * 2.4
        c_ = candy(f"cdy{k}", (math.cos(a) * 1.5, 3 + math.sin(a), 9 + (k % 7) * 0.5), None, k)
        keyloc(c_, t0, (math.cos(a) * 1.5, 3 + math.sin(a), 9 + (k % 7) * 0.5), "LINEAR")
        keyloc(c_, t1, (math.cos(a) * 2.0, 3 + math.sin(a), 0.3), "LINEAR")
    chill((0, 3, 4), 1000)
    cam = cm(t0, t1, (0, 3, 3.6), "crane", d=12, yaw=0, pitch=2, lens=26, hand=0.8)
    sfx(t0 + 0.2, "confetti", 0.6); sfx(t0 + 0.4, "u_duck", 0.4)


@SH(291, "But dad's voice was getting hoarse: dad rasping, throat")
def z24(t0, t1):
    bank()
    D_ = dad(t0, t1, "worried"); P(D_, t0, (0, 0, 0), 0); talk(D_, t0, t1)
    D_.pose(t0, head=(0, 6, 0)); D_.act(t0 + 0.3, "hold", 1.0, expr="worried")
    cam = cm(t0, t1, (0, 0, 4.6), "push", d=8, yaw=-8, pitch=0, lens=36, hand=1.2)
    sfx(t0 + 0.3, "u_dryfart", 0.0) if False else sfx(t0 + 0.4, "snort", 0.5)


@SH(297, "And then,: suspense beat, dark push")
def z25(t0, t1):
    bank()
    D_ = dad(t0, t1, "worried"); P(D_, t0, (0, 0, 0), 0); talk(D_, t0, t1)
    chill((0, 0, 4), 2200)
    cm(t0, t1, (0, 0, 4.6), "push", d=13, yaw=18, pitch=2, lens=26, hand=0.8)
    sfx(t0, "rise", 0.6)


@SH(299, "the remote needed batteries: remote insert, empty battery blink")
def z26(t0, t1):
    c = collection("RM"); world((0.1, 0.1, 0.2), 0.9); insert_fill()
    box("rm_f", (40, 30, 0.4), (0, 0, -0.2), M("rm_fl", "#2a2a38", 0.3), 0, coll=c)
    r = remote("rmt", (-1.2, 3, 4.5), 1.3, coll=c, rot=(0, 20, 20))
    battery("bt", (1.4, 3, 4.5), 1.2, coll=c, rot=(0, 90, 0))
    bigtext("LOW", (0, 2.2, 7.4), t0 + 0.2, 1.0, "#ff5050")
    light("rm_l", "AREA", (0, -8, 10), 4500, (1, 0.95, 0.9), 8, coll=c, target=(0, 3, 4.5))
    cam = cm(t0, t1, (0, 3, 4.5), "push", d=17, yaw=0, pitch=2, lens=30, hand=1.2)
    hit(cam, t0 + 0.2, 30, 42)
    sfx(t0 + 0.2, "buzzer", 0.5); sfx(t0 + 0.7, "click", 0.5)


@SH(303, "He yawned: dad yawns huge, eyes closed")
def z27(t0, t1):
    bank()
    D_ = dad(t0, t1, "yawn"); P(D_, t0, (0, 0, 0), 0)
    D_.face(t0 + 0.1, eyes="closed", mouth="yawn")
    D_.pose(t0 + 0.2, head=(0, -10, 0), armL=(100, 20), armR=(100, 20))
    cm(t0, t1, (0, 0, 4.6), "push", d=8, yaw=10, pitch=1, lens=36, hand=0.8)
    sfx(t0 + 0.15, "aww", 0.0) if False else sfx(t0 + 0.2, "u_quack", 0.0) if False else sfx(t0 + 0.2, "wind", 0.5)


@SH(305, "running out of boring: boring-meter bar drains")
def z28(t0, t1):
    c = collection("MTR"); world((0.1, 0.1, 0.2), 0.9); insert_fill()
    box("mt_bg", (50, 0.4, 24), (0, 6, 8), M("mt_bgm", "#2a2a5a", 0.6), 0, coll=c)
    label("mt_l", "BORING", (0, 5.6, 11.5), 1.7, "#ffffff", estr=1.0)
    box("mt_frame", (14, 0.5, 2.6), (0, 5.4, 7), M("mt_fr", "#f4f4f4", 0.3), 0.08, coll=c)
    box("mt_inner", (13.2, 0.55, 1.9), (0, 5.3, 7), M("mt_in", "#14142a", 0.4), 0.05, coll=c)
    bar = box("mt_bar", (13.0, 0.6, 1.7), (0, 5.2, 7), M("mt_barm", "#e83a3a", 0.4, emit=(1, 0.2, 0.2), estr=1.5), 0.03, coll=c)
    bar.scale = (1.0, 1, 1); bar.location = (0, 5.2, 7)
    bar.keyframe_insert("scale", frame=F(t0)); bar.keyframe_insert("location", frame=F(t0))
    bar.scale = (0.08, 1, 1); bar.location = (-6.0, 5.2, 7)
    bar.keyframe_insert("scale", frame=F(t1)); bar.keyframe_insert("location", frame=F(t1))
    set_interp(bar, "scale", F(t0), "LINEAR"); set_interp(bar, "location", F(t0), "LINEAR")
    light("mt_l2", "AREA", (0, -10, 10), 3000, (1, 1, 1), 10, coll=c, target=(0, 5, 7))
    cam = cm(t0, t1, (0, 5.2, 7), "push", d=15, yaw=0, pitch=0, lens=28, hand=1.8)
    sfx(t0 + 0.1, "rise", 0.0) if False else sfx(t0 + 0.1, "alarm", 0.35)
    sfx(t1 - 0.4, "buzzer", 0.5)


@SH(311, "Then I noticed something: Sam eyes light up, ding")
def r01(t0, t1):
    bank()
    E = kid_sam(t0, t1, "gasp"); P(E, t0, (0, 0, 0), 0); E.act(t0 + 0.1, "point", 1.0, expr="gasp")
    bigtext("!", (0.6, -1.4, 8.6), t0 + 0.2, 2.4, "#ffe070")
    cam = cm(t0, t1, (0, 0, 4.7), "push", d=10, yaw=-10, pitch=2, lens=28, hand=1.0)
    hit(cam, t0 + 0.2, 28, 44)
    sfx(t0 + 0.2, "ding", 0.9); sfx(t0 + 0.2, "u_correct", 0.5)


@SH(315, "If I made the story more interesting: bubble with fireworks")
def r02(t0, t1):
    bank()
    E = kid_sam(t0, t1, "smug"); P(E, t0, (-3, 0, 0), 20); E.act(t0, "think", 1.0, expr="smug")
    cont = bubble("thought", (3, 3, 9.5), t0 + 0.2, None, 1.1, tail_to=(-1.5, 0, 6.2))
    for k in range(8):
        a = k / 8 * math.tau
        sphere(f"fw{k}", 0.2, (math.cos(a) * 1.2, -0.4, math.sin(a) * 1.0), M("fw" + str(k % 3), ["#ff5a7a", "#ffe070", "#5ad0ff"][k % 3], 0.3, emit=(1, 0.8, 0.5), estr=4), parent=cont, seg=8)
    cm(t0, t1, (0, 1, 5.4), "push", d=13, yaw=-8, pitch=3, lens=26, hand=1.0)
    sfx(t0 + 0.2, "sparkle", 0.7)


@SH(322, "time would start again: robbers twitch, clock ticks")
def r03(t0, t1):
    bank()
    for i, x in enumerate((-7, 0, 7)):
        R = robber(i, t0, t1, "furious"); P(R, t0, (x, 4, 0), 0); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
        for k in range(3):
            R.pose(t0 + 0.5 + k * 0.25, head=(4, 0, 3)); R.pose(t0 + 0.62 + k * 0.25, head=(-4, 0, -3))
    clock_face("tc", (0, 11.5, 11), t0, t1, 1.2, coll=None, facing_rot=(90, 0, 0), turns=2)
    chill((0, 3, 4), 1800)
    cam = cm(t0, t1, (0, 3, 4.6), "dutch", d=15, yaw=0, pitch=2, lens=26, hand=2.0)
    sfx(t0, "click", 0.5); sfx(t0 + 0.5, "click", 0.5); sfx(t0 + 1.0, "click", 0.5)


@SH(326, "But if I made it more boring...: Sam sly grin")
def r04(t0, t1):
    bank()
    E = kid_sam(t0, t1, "smug"); P(E, t0, (0, 0, 0), 0); E.face(t0 + 0.7, "sus")
    cm(t0, t1, (0, 0, 4.7), "push", d=8, yaw=14, pitch=1, lens=40, hand=0.8)
    sfx(t0 + 0.5, "u_rizz", 0.35)


@SH(333, "Dad, I said.: Sam turns to dad")
def r05(t0, t1):
    bank()
    E = kid_sam(t0, t1, "smug"); P(E, t0, (-1.3, 0, 0), -30); lips(E, t0, t1)
    D_ = dad(t0, t1, "talk"); P(D_, t0, (1.5, 0, 0), 30); talk(D_, t0, t1)
    cm(t0, t1, (0.1, 0, 4.4), "slide", d=12, yaw=0, pitch=2, lens=28, hand=1.0)


@SH(336, "Tell me about the batteries: Sam asks, dad's head turns")
def r06(t0, t1):
    bank()
    E = kid_sam(t0, t1, "smug"); P(E, t0, (-1.3, 0, 0), -30); lips(E, t0, t1)
    D_ = dad(t0, t1, "confused"); P(D_, t0, (1.5, 0, 0), 30)
    D_.pose(t0 + 0.9, head=(-25, 0, 0)); D_.face(t0 + 0.9, "gasp")
    cam = cm(t0, t1, (0.1, 0, 4.4), "push", d=12, yaw=8, pitch=2, lens=26, hand=1.0)
    hit(cam, t0 + 0.9, 26, 36)
    sfx(t0 + 0.9, "ding", 0.5)


@SH(341, "The exact brand: battery with brand label")
def r07(t0, t1):
    c = collection("BAT"); world((0.1, 0.1, 0.2), 0.9); insert_fill()
    box("bt_f", (40, 30, 0.4), (0, 0, -0.2), M("bt_fl", "#2a2a38", 0.3), 0, coll=c)
    b = battery("bt", (0, 3, 3.5), 1.8, coll=c, rot=(0, 0, 0))
    b.rotation_euler = (0, 0, 0); b.keyframe_insert("rotation_euler", frame=F(t0))
    b.rotation_euler = (0, 0, math.radians(180)); b.keyframe_insert("rotation_euler", frame=F(t1)); set_interp(b, "rotation_euler", F(t0), "LINEAR")
    label("bt_t", "MEGAVOLT", (0, 2.0, 7.4), 0.5, "#ffe070", extrude=0.04, estr=0.6)
    light("bt_l", "AREA", (3, -8, 10), 5000, (1, 0.95, 0.9), 6, coll=c, target=(0, 3, 3.5))
    cam = cm(t0, t1, (0, 3, 4.5), "push", d=16, yaw=0, pitch=2, lens=34, hand=1.0)
    hit(cam, t0 + 0.1, 34, 46)
    sfx(t0 + 0.1, "u_correct", 0.6)


@SH(344, "the expiration date: date label")
def r08(t0, t1):
    c = collection("EXP"); world((0.1, 0.1, 0.2), 0.9); insert_fill()
    box("ex_f", (40, 30, 0.4), (0, 0, -0.2), M("ex_fl", "#2a2a38", 0.3), 0, coll=c)
    box("ex_tag", (9, 0.4, 4.5), (0, 3, 5.0), M("ex_tagm", "#f4f4ee", 0.5), 0.1, coll=c)
    label("ex_h", "EXP", (0, 2.7, 6.2), 1.3, "#2a2a30", extrude=0.03)
    label("ex_d", "12/2031", (0, 2.7, 4.2), 1.3, "#d9453a", extrude=0.03)
    light("ex_l", "AREA", (0, -8, 10), 4500, (1, 1, 1), 8, coll=c, target=(0, 3, 5))
    cm(t0, t1, (0, 3, 5.0), "slide", d=19, yaw=0, pitch=2, lens=30, hand=1.2)
    sfx(t0 + 0.1, "paper", 0.7)


@SH(347, "what they cost: price tag $2.99")
def r09(t0, t1):
    c = collection("PRC"); world((0.1, 0.1, 0.2), 0.9); insert_fill()
    box("pr_f", (40, 30, 0.4), (0, 0, -0.2), M("pr_fl", "#2a2a38", 0.3), 0, coll=c)
    tag = box("pr_tag", (6, 0.4, 4.2), (0, 3, 5.0), M("pr_tagm", "#ffe070", 0.5), 0.12, coll=c)
    label("pr_t", "$2.99", (0, 2.7, 5.0), 1.5, "#2a2a30", extrude=0.04)
    pop_in(tag, t0 + 0.05, 1.0)
    light("pr_l", "AREA", (0, -8, 10), 4500, (1, 1, 1), 8, coll=c, target=(0, 3, 5))
    cam = cm(t0, t1, (0, 3, 5.0), "dutch", d=17, yaw=0, pitch=2, lens=28, hand=1.5, roll=-6)
    hit(cam, t0 + 0.2, 28, 38)
    sfx(t0 + 0.05, "cashier", 0.8)


@SH(350, "His eyes lit up: dad eyes sparkle, extreme close")
def r10(t0, t1):
    bank()
    D_ = dad(t0, t1, "gasp"); P(D_, t0, (0, 0, 0), 0)
    D_.face(t0 + 0.1, eyes="happy", mouth="open_smile")
    for k in range(4):
        sphere(f"sp{k}", 0.1 + 0.03 * (k % 2), (-0.5 + (k % 2) * 1.0, -0.7, 5.0 + (k // 2) * 0.35), M("spk", "#fff4a0", 0.3, emit=(1, 0.95, 0.5), estr=8), seg=6)
    cam = cm(t0, t1, (0, 0, 4.8), "push", d=7, yaw=0, pitch=0, lens=36, hand=0.6)
    hit(cam, t0 + 0.2, 36, 50)
    sfx(t0 + 0.2, "sparkle", 0.9); sfx(t0 + 0.2, "ding", 0.6)


@SH(354, "He had never been asked before: dad touched, tear")
def r11(t0, t1):
    bank()
    D_ = dad(t0, t1, "cry"); P(D_, t0, (0, 0, 0), 0); D_.act(t0 + 0.2, "hands_face", 1.0, expr="cry")
    t = tears(D_, t0 + 0.2, t1)
    cm(t0, t1, (0, 0, 4.4), "push", d=9, yaw=-10, pitch=2, lens=32, hand=0.8)
    sfx(t0 + 0.2, "aww", 0.8)


@SH(360, "Well, kiddo.: dad warm smile, rizz")
def r12(t0, t1):
    bank()
    D_ = dad(t0, t1, "smile"); P(D_, t0, (0, 0, 0), 0); talk(D_, t0, t1); D_.act(t0 + 0.2, "hold", 1.0, expr="smile")
    cm(t0, t1, (0, 0, 4.6), "orbit", d=8, yaw=0, pitch=2, lens=34, hand=0.8)
    sfx(t0 + 0.1, "u_rizz", 0.5)


@SH(362, "Time stayed frozen: frozen bank, dad talks on")
def r13(t0, t1):
    bank()
    D_ = dad(t0, t1, "happy"); P(D_, t0, (0, -2, 0), 0); talk(D_, t0, t1); D_.act(t0 + 0.2, "point", 1.0)
    for i, x in enumerate((-7, 0, 7)):
        R = robber(i, t0, t1, "furious"); P(R, t0, (x, 5, 0), 0); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
    chill((0, 2, 4), 3000); frost_motes((0, 2, 0), (20, 8, 9), 70)
    cm(t0, t1, (0, 1, 4.2), "crane", d=19, yaw=-12, pitch=4, lens=22, hand=0.3)
    sfx(t0, "crickets", 0.7)


@SH(365, "Eleven minutes: giant clock 11")
def r14(t0, t1):
    c = collection("CK11"); world((0.12, 0.14, 0.3), 0.9); insert_fill()
    box("ck_bg", (40, 0.4, 24), (0, 4, 8), M("ck_bgm", "#8a2a3a", 0.6), 0, coll=c)
    clock_face("ck", (0, 0, 6.5), t0, t1, 1.6, coll=c, turns=3)
    bigtext("11:00", (0, -0.7, 1.0), t0 + 0.1, 1.8, "#ffe070")
    light("ck_l", "AREA", (0, -10, 10), 3500, (1, 1, 1), 10, coll=c, target=(0, 0, 5))
    cam = cm(t0, t1, (0, 0, 4.5), "push", d=26, yaw=0, pitch=0, lens=28, hand=2.0)
    hit(cam, t0 + 0.1, 28, 42)
    sfx(t0 + 0.1, "ding", 0.8)


@SH(367, "Then the police arrived: police cars with lights pull up")
def r15(t0, t1):
    street()
    c = collection("PO")
    for k in range(2):
        car_ = W.car(f"cop{k}", (-14 + k * 14, -50, 0), "#f4f4f4", coll=c, rot=0)
        keyloc(car_, t0, (-14 + k * 14, -60, 0), "LINEAR"); keyloc(car_, t1, (-14 + k * 14, -38, 0), "BEZIER")
        for s_ in (-1, 1):
            L = sphere(f"siren{k}{s_}", 0.7, (0.0 + s_ * 0.9, 0, 3.2), M("siren" + str(s_), "#ff2a2a" if s_ < 0 else "#2a5aff", 0.3, emit=(1, 0.2, 0.2) if s_ < 0 else (0.2, 0.3, 1), estr=8), parent=car_, seg=8)
            lt = light(f"sir_l{k}{s_}", "POINT", (s_ * 1.0, -1, 3.4), 3000, (1, 0.2, 0.2) if s_ < 0 else (0.2, 0.3, 1), 0.5, coll=c)
            lt.parent = car_
    cam = cm(t0, t1, (0, -40, 3), "slide", d=22, yaw=0, pitch=6, lens=24, hand=2.0)
    sfx(t0, "alarm", 0.6); sfx(t0 + 0.4, "whoosh", 0.8)


@SH(372, "and dad finally stopped: dad closes mouth, still")
def r16(t0, t1):
    bank()
    D_ = dad(t0, t1, "talk"); P(D_, t0, (0, 0, 0), 0); talk(D_, t0, t0 + 1.0)
    D_.face(t0 + 1.0, "relief"); D_.pose(t0 + 1.0, head=(0, 4, 0))
    cm(t0, t1, (0, 0, 4.5), "push", d=9, yaw=10, pitch=2, lens=30, hand=0.8)
    sfx(t0 + 1.0, "u_dryfart", 0.0) if False else sfx(t0 + 1.0, "ding", 0.5)


@SH(375, "Click!: snap, flash, time restarts")
def r17(t0, t1):
    bank()
    for i, x in enumerate((-7, 0, 7)):
        R = robber(i, t0, t1, "furious"); P(R, t0, (x, 4, 0), 0); R.act(t0, "point", 1.0, expr="furious"); blaster(R)
        R.act(t0 + 0.12, "recoil", 1.0, expr="shock")
    flash(t0 + 0.05, 2.8, 0.35)
    bigtext("CLICK!", (0, -3, 8), t0 + 0.08, 2.8, "#ffe070")
    cam = cm(t0, t1, (0, 3, 4.2), "dutch", d=12, yaw=0, pitch=2, lens=24, hand=3.0, roll=7)
    hit(cam, t0 + 0.05, 24, 38)
    sfx(t0 + 0.05, "u_click", 1.0); sfx(t0 + 0.05, "click", 0.7); sfx(t0 + 0.12, "gasp", 0.5)


@SH(376, "The robbers woke up in handcuffs: cuffs on robbers")
def r18(t0, t1):
    bank()
    for i, x in enumerate((-6, 0, 6)):
        R = robber(i, t0, t1, "confused"); P(R, t0, (x, 3, 0), 0); R.act(t0, "recoil", 1.0, expr="confused")
        R.pose(t0 + 0.2, armL=(60, -10), armR=(60, -10))
        box(f"cuff{i}", (1.4, 0.35, 0.3), (0, -1.4, -1.85), M("cuff", "#c8ccd4", 0.2, metal=1), 0.05, parent=R.hip, coll=R.coll)
        K = cop(i, t0, t1, "smug"); P(K, t0, (x + 2.2, 0.5, 0), -20)
        pt_ = None
    cam = cm(t0, t1, (0, 3, 3.8), "slide", d=13, yaw=0, pitch=3, lens=26, hand=1.5)
    sfx(t0 + 0.1, "clink", 0.9); sfx(t0 + 0.5, "clink", 0.7)


@SH(382, "completely confused: robber confused closeup")
def r19(t0, t1):
    bank()
    R = robber(0, t0, t1, "confused"); P(R, t0, (0, 3, 0), 0); R.face(t0 + 0.2, "confused")
    R.pose(t0 + 0.3, head=(14, 0, 8)); R.pose(t0 + 0.7, head=(-14, 0, -8))
    bigtext("?", (1.6, 1.5, 7.2), t0 + 0.3, 2.2, "#ffffff")
    cam = cm(t0, t1, (0, 3, 4.7), "push", d=8, yaw=0, pitch=1, lens=38, hand=0.8)
    hit(cam, t0 + 0.3, 38, 48)
    sfx(t0 + 0.3, "boing", 0.7); sfx(t0 + 0.9, "u_duck", 0.5)


# ------------------------------------------------ ending
@SH(384, "That night, dad sat on my bed: bedroom night")
def e01(t0, t1):
    sam_room(True)
    E = kid_sam(t0, t1, "relief"); P(E, t0, (-8.5, 3.6, 2.7), 0, hipz=-1.0, legL=(85, 3), legR=(85, -3))
    E.root.rotation_euler[0] = 0
    D_ = dad(t0, t1, "smile"); P(D_, t0, (-3.5, 1.6, 0), 0)
    D_.pose(t0, loc=(-2.5, 1.6, 0), rot=0); D_.pose(t0 + 0.7, loc=(-6.4, 2.2, 0.3), rot=0, hipz=-1.0, legL=(85, 3), legR=(85, -3))
    cam = cm(t0, t1, (-6, 2, 4.2), "push", d=14, yaw=-8, pitch=4, lens=24, hand=0.8)
    sfx(t0 + 0.7, "place", 0.6)


@SH(391, "Thanks for asking about the batteries: dad warm closeup")
def e02(t0, t1):
    sam_room(True)
    D_ = dad(t0, t1, "smile"); P(D_, t0, (-5.5, 3.2, 0), 0, hipz=-1.0, legL=(85, 3), legR=(85, -3)); talk(D_, t0, t1)
    D_.pose(t0, head=(-10, 0, 3))
    cm(t0, t1, (-5.5, 3.2, 3.6), "push", d=9, yaw=-12, pitch=3, lens=32, hand=0.6)
    sfx(t0 + 0.3, "aww", 0.6)


@SH(397, "I smiled: Sam soft smile")
def e03(t0, t1):
    sam_room(True)
    E = kid_sam(t0, t1, "smile"); P(E, t0, (-8.5, 3.6, 2.7), 0, hipz=-1.0, legL=(85, 3), legR=(85, -3))
    E.face(t0 + 0.3, "smile")
    cm(t0, t1, (-8.5, 3.6, 4.8), "push", d=8, yaw=6, pitch=2, lens=36, hand=0.5)
    sfx(t0 + 0.2, "sparkle", 0.6)


@SH(399, "Tell me more: Sam asks, dad turns")
def e04(t0, t1):
    sam_room(True)
    E = kid_sam(t0, t1, "happy"); P(E, t0, (-8.5, 3.6, 2.7), 20, hipz=-1.0, legL=(85, 3), legR=(85, -3)); lips(E, t0, t1)
    D_ = dad(t0, t1, "gasp"); P(D_, t0, (-4.8, 2.4, 0), -30, hipz=-1.0, legL=(85, 3), legR=(85, -3)); D_.act(t0 + 0.5, "cheer", 1.0, expr="joy")
    cam = cm(t0, t1, (-6.6, 3, 3.8), "slide", d=12, yaw=0, pitch=4, lens=26, hand=0.8)
    hit(cam, t0 + 0.7, 26, 34)
    sfx(t0 + 0.7, "ding", 0.6); sfx(t0 + 0.7, "u_applepay", 0.45)


@SH(402, "Well, it all started in 1994: dad story-time, orbit")
def e05(t0, t1):
    sam_room(True)
    D_ = dad(t0, t1, "happy"); P(D_, t0, (-5, 2.4, 0), -20, hipz=-1.0, legL=(85, 3), legR=(85, -3)); talk(D_, t0, t1); D_.act(t0 + 0.4, "point", 1.0)
    E = kid_sam(t0, t1, "smile"); P(E, t0, (-8.5, 3.6, 2.7), 20, hipz=-1.0, legL=(85, 3), legR=(85, -3))
    bigtext("1994", (-6.5, 1.0, 9.4), t0 + 1.2, 1.5, "#ffe070")
    cam = cm(t0, t1, (-6.6, 3, 4.0), "orbit", d=13, yaw=0, pitch=4, lens=26, hand=0.8)
    sfx(t0 + 1.2, "pop", 0.6)


@SH(408, "And this time, I didn't roll my eyes: Sam eyes steady, pull back")
def e06(t0, t1):
    sam_room(True)
    E = kid_sam(t0, t1, "smile"); P(E, t0, (-8.5, 3.6, 2.7), 0, hipz=-1.0, legL=(85, 3), legR=(85, -3))
    E.face(t0 + 1.2, eyes="happy", mouth="smile")
    D_ = dad(t0, t1, "happy"); P(D_, t0, (-5, 2.4, 0), -30, hipz=-1.0, legL=(85, 3), legR=(85, -3)); talk(D_, t0, t1)
    cam = Cam(); cam.push(t0, t1, (-8.5, 3.6, 4.8), 7, 12, yaw=0, pitch=2, lens=34, yaw1=-10, pitch1=6); cam.handheld(0.6)
    sfx(t0 + 1.2, "sparkle", 0.6); sfx(t1 - 0.8, "u_discord", 0.0) if False else None


# ================================================================== register
for _k, (_a, _fn, _d) in enumerate(FUNCS):
    _b = FUNCS[_k + 1][0] if _k + 1 < len(FUNCS) else None
    S(_k + 1, _a, _b, _d)(_fn)
