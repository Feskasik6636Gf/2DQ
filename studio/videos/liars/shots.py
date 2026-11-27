"""liars: "In this world, every lie you tell crawls out of your mouth as a monster." 58 shots keyed to script word indices."""
from shotkit import *
from rbx import story, locs, fx
from rbx.story import *
import math, random, os
from mathutils import Vector

V = Video(__file__)
story.bind(V)
TEX = W.TEX


# ------------------------------------------------------------------ cast
def mia(t0, t1, expr="neutral"):
    return story._live(chars.Char("Mia", skin="#f1dfc6", shirt="#ee7aa8", pants="#3d4a8a", hair="bob",
                                  hair_color="#6a3a22", face="girl", sleeves="short"), t0, t1, expr)


def sam(t0, t1, expr="neutral"):
    return story._live(chars.Char("Sam", skin="#e0b98f", shirt="#f0a030", pants="#2f3f6a", hair="messy",
                                  hair_color="#1d1714", face="kid", sleeves="short"), t0, t1, expr)


def dad(t0, t1, expr="neutral"):
    return story._live(chars.Char("Dad", skin="#e9c7a6", shirt="#4a7ab8", shirt_kind="checker", shirt_c2="#2f5a94",
                                  pants="#3b3f4a", hair="short", hair_color="#3a2a1e", face="mustache",
                                  sleeves="long", scale=1.15), t0, t1, expr)


def at(ch, t, x, y, rot=0.0, **kw):
    ch.pose(t, loc=(x, y, 0), rot=rot, **kw)
    return ch


def hd(x, y, s=1.0, dz=0.0):
    return (x, y, 4.7 * s + dz)


def cu(t0, t1, pos, s=1.0, d0=6.0, d1=4.8, rot=0.0, off=-10, pitch=2, lens=30, dz=0.0, off1=None, hh=0.6):
    cam = Cam()
    cam.push(t0, t1, hd(pos[0], pos[1], s, dz), d0, d1, yaw=rot + off, pitch=pitch, lens=lens,
             yaw1=None if off1 is None else rot + off1)
    cam.handheld(hh)
    return cam


# ------------------------------------------------------------------ monster
def beast(name, loc=(0, 0, 0), s=1.0, rot=0.0, coll=None, fur="#5b3d8c"):
    c = coll or collection("B_" + name)
    root = empty(name + "_root", loc, None, c, (0, 0, rot), 0.5)
    root.scale = (s,) * 3
    Mf = mat("beast_fur", hexc(fur), 0.95)
    Md = mat("beast_dark", hexc("#2a1c44"), 0.9)
    Mw = mat("beast_white", hexc("#f4f0e4"), 0.4)
    Me = mat("beast_eye", hexc("#ffd21f"), 0.3, emit=hexc("#ffcc00"), estr=7.0)
    Mp = mat("beast_pupil", hexc("#120a08"), 0.3)
    sphere(name + "_body", 2.3, (0, 0.8, 2.6), Mf, (1.05, 1.45, 1.0), parent=root, coll=c)
    for i in range(5):
        box(f"{name}_sp{i}", (0.7, 0.7, 1.3), (0, 0.9 + i * 0.9 - 1.4, 5.0 - abs(i - 2) * 0.35), Md, 0.1, parent=root,
            coll=c, rot=(0, 0, 45))
    head = empty(name + "_head", (0, -2.2, 3.5), root, c)
    sphere(name + "_skull", 1.55, (0, 0, 0), Mf, (1.1, 1.0, 1.0), parent=head, coll=c)
    sphere(name + "_snout", 0.95, (0, -1.1, -0.35), Mf, (1.1, 1.1, 0.8), parent=head, coll=c)
    sphere(name + "_nose", 0.3, (0, -1.95, -0.1), Md, parent=head, coll=c)
    jaw = empty(name + "_jaw", (0, -0.6, -0.65), head, c)
    box(name + "_jawb", (1.9, 1.7, 0.45), (0, -0.7, -0.1), Mf, 0.15, parent=jaw, coll=c)
    box(name + "_mouthin", (1.6, 1.5, 0.12), (0, -0.7, 0.12), mat("beast_mouth", hexc("#3a0a14"), 0.6), 0.03, parent=jaw,
        coll=c)
    for i in range(5):
        x = (i - 2) * 0.38
        box(f"{name}_tu{i}", (0.2, 0.2, 0.55), (x, -1.45, -0.5), Mw, 0.05, parent=head, coll=c)
        box(f"{name}_tl{i}", (0.2, 0.2, 0.5), (x, -1.4, 0.38), Mw, 0.05, parent=jaw, coll=c)
    eyes = []
    for sx in (-1, 1):
        e = sphere(f"{name}_eye{sx}", 0.36, (sx * 0.72, -1.2, 0.55), Me, (1, 0.7, 1), parent=head, coll=c)
        sphere(f"{name}_pup{sx}", 0.13, (sx * 0.72, -1.52, 0.55), Mp, (0.6, 0.5, 1.2), parent=head, coll=c)
        box(f"{name}_brow{sx}", (0.9, 0.2, 0.2), (sx * 0.72, -1.35, 0.95), Md, 0.05, parent=head, coll=c,
            rot=(0, sx * 18, 0))
        sphere(f"{name}_ear{sx}", 0.55, (sx * 1.15, 0.1, 1.15), Mf, (0.7, 0.6, 1.2), parent=head, coll=c)
        cyl(f"{name}_horn{sx}", 0.2, 1.1, (sx * 0.9, 0.0, 1.55), mat("beast_horn", hexc("#e8d8b0"), 0.5), 12, parent=head,
            coll=c, rot=(0, sx * 20, 0))
        eyes.append(e)
    for sx in (-1, 1):
        for fy in (-1.2, 2.4):
            cyl(f"{name}_leg{sx}{fy}", 0.8, 2.4, (sx * 1.6, fy, 1.2), Mf, 16, bev=0.1, parent=root, coll=c)
            for k in (-1, 0, 1):
                box(f"{name}_cl{sx}{fy}{k}", (0.22, 0.6, 0.22), (sx * 1.6 + k * 0.38, fy - 0.8, 0.12), Mw, 0.04, parent=root,
                    coll=c)
    for i in range(4):
        sphere(f"{name}_tail{i}", 0.85 - i * 0.14, (0, 3.6 + i * 1.0, 1.6 + i * 0.35), Mf, parent=root, coll=c)
    return dict(root=root, head=head, jaw=jaw, eyes=eyes, coll=c)


def jaw_open(B, t, deg, dur=0.2):
    B["jaw"].keyframe_insert("rotation_euler", index=0, frame=F(t - dur))
    B["jaw"].rotation_euler[0] = math.radians(deg)
    B["jaw"].keyframe_insert("rotation_euler", index=0, frame=F(t))


def scale_key(ob, t, s):
    ob.scale = (s,) * 3
    ob.keyframe_insert("scale", frame=F(t))


def growl(B, t0, t1, rate=0.45, deg=22):
    t = t0
    while t < t1:
        jaw_open(B, t + rate * 0.5, deg, rate * 0.5)
        jaw_open(B, t + rate, 3, rate * 0.5)
        t += rate


def loc_key(ob, t, p):
    ob.location = p
    ob.keyframe_insert("location", frame=F(t))


# ------------------------------------------------------------------ props & sets
def torch(name, coll=None):
    r = empty(name, (0, 0, 0), None, coll, (0, 0, 0), 0.2)
    cyl(name + "_stick", 0.14, 3.2, (0, 0, 0), mat("stick", hexc("#6b4526"), 0.8), 10, parent=r, coll=coll)
    f = fx.fire_card(name + "_fire", (0, 0, 1.8), 1.3, 1.9, 0, coll)
    f.parent = r
    light(name + "_l", "POINT", (0, -0.3, 1.9), 900, (1.0, 0.55, 0.2), 0.4, coll=coll).parent = r
    return r


def bowl(name, coll=None):
    r = empty(name, (0, 0, 0), None, coll, (0, 0, 0), 0.2)
    cyl(name + "_b", 0.65, 0.4, (0, 0, 0), mat("bowl", hexc("#d8d8e0"), 0.3), 20, bev=0.05, parent=r, coll=coll)
    sphere(name + "_food", 0.55, (0, 0, 0.18), mat("food", hexc("#b8763a"), 0.7), (1, 1, 0.5), parent=r, coll=coll)
    return r


def siren_lights(t0, t1, loc=(0, -20, 6), energy=3500, rate=0.28):
    a = light("sirR", "POINT", loc, energy, (1.0, 0.1, 0.08), 0.5)
    b = light("sirB", "POINT", (loc[0] + 4, loc[1], loc[2]), energy, (0.1, 0.25, 1.0), 0.5)
    t, k = t0, 0
    while t < t1:
        for L, on in ((a, k % 2 == 0), (b, k % 2 == 1)):
            L.data.energy = energy if on else 0.0
            L.data.keyframe_insert("energy", frame=F(t))
        t += rate
        k += 1
    return a, b


def night_world(moon=True):
    world((0.07, 0.11, 0.30), 1.0)
    if moon:
        light("moon", "AREA", (14, -24, 40), 24000, (0.62, 0.72, 1.0), 40, target=(0, 6, 2))
        light("nfill", "AREA", (-6, -34, 22), 36000, (0.55, 0.65, 1.0), 40, target=(0, 18, 5))
        sphere("moon_disc", 9, (-60, 170, 110), mat("moon_m", hexc("#f4f1da"), 0.5, emit=hexc("#f4f1da"), estr=6.0))


def night_street():
    night_world()
    S_ = locs.street_dusk()
    car = D.objects.get("car_root")
    return S_


def cellar():
    world((0.012, 0.012, 0.025), 0.3)
    c = collection("CELLAR")
    Ms = mat("c_stone", hexc("#625c54"), 0.9)
    box("c_floor", (40, 44, 0.4), (0, 4, -0.2), mat("c_floor", hexc("#4a4640"), 0.9), 0, coll=c)
    box("c_back", (40, 0.6, 12), (0, 15, 6), Ms, 0, coll=c)
    for sx in (-1, 1):
        box(f"c_side{sx}", (0.6, 44, 12), (sx * 15, 4, 6), Ms, 0, coll=c)
    box("c_ceil", (40, 44, 0.4), (0, 4, 12.2), mat("c_ceil", hexc("#3b3733"), 0.9), 0, coll=c)
    Mi = mat("furnace", hexc("#2c2c33"), 0.4, metal=0.5)
    box("f_body", (6, 5, 7), (0, 11.5, 3.5), Mi, 0.2, coll=c)
    cyl("f_pipe", 0.9, 6, (0, 12.5, 10.0), Mi, 20, coll=c)
    card("f_glow", 2.6, 2.4, (0, 8.95, 2.4), mat("f_glow", hexc("#ff8a2a"), 0.5, emit=hexc("#ff7a1a"), estr=9.0), "-Y",
         coll=c)
    box("f_frame", (3.2, 0.3, 3.0), (0, 9.1, 2.4), mat("f_frame", hexc("#111114"), 0.5), 0.05, coll=c)
    box("f_stump", (3.6, 0.3, 3.4), (0, 9.2, 2.4), Mi, 0.05, coll=c)
    Mc = mat("crate", hexc("#7a5230"), 0.8)
    for i, (x, y, z) in enumerate([(-11, 11, 1.4), (-11, 8, 1.4), (-11, 11, 4.2), (11.5, 11, 1.4), (11.5, 8.5, 1.4)]):
        box(f"crate{i}", (2.8, 2.8, 2.8), (x, y, z), Mc, 0.1, coll=c, rot=(0, 0, i * 11))
    for i in range(6):
        cyl(f"jar{i}", 0.5, 1.0, (-12.5 + i * 0.5 * 0 + (i % 3) * 1.1, 14.2, 7.0 + (i // 3) * 1.4),
            mat(f"jar{i}", hexc(["#c04040", "#d0a030", "#40a060"][i % 3]), 0.2, alpha=0.9), 14, coll=c)
    box("c_shelf", (4.5, 0.8, 0.2), (-11, 14.4, 6.4), Mc, 0.02, coll=c)
    light("c_fire", "POINT", (0, 7.0, 3.0), 2200, (1.0, 0.5, 0.2), 1.2, coll=c)
    light("c_key", "AREA", (0, -4, 11), 2600, (0.75, 0.8, 1.0), 14, coll=c, target=(0, 7, 1))
    light("c_fill", "AREA", (-9, -6, 6), 1100, (1.0, 0.7, 0.45), 8, coll=c, target=(0, 7, 3))
    return c


def house_night():
    night_world()
    c = collection("HOUSE")
    box("h_ground", (120, 120, 0.4), (0, 20, -0.2), mat("h_grass", hexc("#27402f"), 0.95), 0, coll=c)
    box("h_house", (22, 10, 10), (0, 16, 5), mat("h_wall", hexc("#8f7060"), 0.8), 0.1, coll=c)
    box("h_roof", (24, 12, 1.4), (0, 16, 10.6), mat("h_roof", hexc("#4a2f2a"), 0.7), 0.1, coll=c)
    box("h_door", (3, 0.3, 6.2), (-5, 10.9, 3.1), mat("h_door", hexc("#6a3a22"), 0.7), 0.05, coll=c)
    Mw = mat("h_win", (1, 0.85, 0.55), emit=(1.0, 0.75, 0.4), estr=3.5)
    for x in (3, 8):
        card(f"h_w{x}", 2.6, 2.8, (x, 10.8, 5.2), Mw, "-Y", coll=c)
    box("c_base", (6.4, 4.6, 1.4), (0, 3, 0.7), mat("c_base", hexc("#55504a"), 0.9), 0.05, coll=c)
    plane("c_hole", 5.4, 3.7, (0, 3, 1.43), mat("c_hole", hexc("#ff9a40"), 0.6, emit=hexc("#ff8a30"), estr=3.5),
          (0, 0, 0), None, c)
    Md = mat("c_door", hexc("#3b2a1c"), 0.8)
    hinges = []
    for sx in (-1, 1):
        hg = empty(f"c_hinge{sx}", (sx * 2.85, 3, 1.5), None, c, (0, 0, 0), 0.3)
        box(f"c_door{sx}", (2.8, 4.0, 0.25), (-sx * 1.4, 0, 0.1), Md, 0.04, parent=hg, coll=c)
        hinges.append(hg)
    for sx in (-1, 1):
        light("h_porch", "POINT", (-5, 8, 7), 1500, (1.0, 0.8, 0.5), 0.4, coll=c)
        break
    return hinges


def door_open(hinges, t, dur=0.5, deg=105):
    for hg, sx in zip(hinges, (-1, 1)):
        hg.rotation_euler[1] = 0
        hg.keyframe_insert("rotation_euler", index=1, frame=F(t))
        hg.rotation_euler[1] = math.radians(-sx * deg)
        hg.keyframe_insert("rotation_euler", index=1, frame=F(t + dur))


def claw_marks(x0, x1, y, n=6, coll=None):
    Mk = mat("claw", hexc("#0a0807"), 0.9)
    for i in range(n):
        x = x0 + (x1 - x0) * i / max(1, n - 1)
        for k in (-1, 0, 1):
            box(f"claw{i}{k}", (1.6, 0.22, 0.06), (x, y + k * 0.7, 0.02), Mk, 0.02, coll=coll, rot=(0, 0, 15 * k))


def smoke_puffs(prefix, loc, t0, t1, n=8, up=9.0, seed=2):
    rnd = random.Random(seed)
    M = mat("smoke", (0.78, 0.76, 0.84), 0.95, alpha=0.7)
    out = []
    for i in range(n):
        s_ = sphere(f"{prefix}{i}", rnd.uniform(0.8, 1.6), (loc[0] + rnd.uniform(-1.5, 1.5), loc[1] + rnd.uniform(-1, 1),
                                                           loc[2] + rnd.uniform(0, 1.5)), M)
        a = t0 + i * (t1 - t0) / (n + 1)
        s_.scale = (0.05,) * 3
        s_.keyframe_insert("scale", frame=F(a - 0.05))
        s_.scale = (1.0,) * 3
        s_.keyframe_insert("scale", frame=F(a + 0.4))
        s_.scale = (0.1,) * 3
        s_.keyframe_insert("scale", frame=F(t1 + 0.6))
        l0 = Vector(s_.location)
        loc_key(s_, a, tuple(l0))
        loc_key(s_, t1 + 0.6, (l0.x + rnd.uniform(-1.5, 1.5), l0.y, l0.z + up))
        out.append(s_)
    return out


def bakery_build(pos=(-17, 10), coll=None):
    root = empty("bakery", (pos[0], pos[1], 0), None, coll, (0, 0, 0), 0.5)
    box("bk_body", (13, 10, 9), (0, 0, 4.5), mat("bk_wall", hexc("#e8c08a"), 0.8), 0.1, parent=root, coll=coll)
    box("bk_roof", (14, 11, 1.2), (0, 0, 9.5), mat("bk_roof", hexc("#a0522d"), 0.7), 0.1, parent=root, coll=coll)
    card("bk_sign", 9, 2.8, (0, -5.15, 7.0), img_mat("bk_sign", os.path.join(TEX, "bakery_sign.png"), 0.5), "-Y",
         parent=root, coll=coll)
    box("bk_win", (6, 0.2, 3), (0, -5.1, 3.2), mat("bk_glass", (0.8, 0.9, 1.0), 0.1, emit=(1.0, 0.85, 0.5), estr=1.5),
        0.05, parent=root, coll=coll)
    return root


def barn_build(pos, coll=None):
    root = empty("barn", (pos[0], pos[1], 0), None, coll, (0, 0, 0), 0.5)
    box("bn_body", (16, 12, 10), (0, 0, 5), mat("bn_red", hexc("#a82e28"), 0.8), 0.1, parent=root, coll=coll)
    box("bn_roof", (17, 13, 1.2), (0, 0, 10.4), mat("bn_roofm", hexc("#4a3a36"), 0.7), 0.1, parent=root, coll=coll)
    box("bn_door", (6, 0.3, 7), (0, -6.1, 3.5), mat("bn_door", hexc("#f0e8e0"), 0.7), 0.05, parent=root, coll=coll)
    return root


def sad_townie(i, t0, t1, x, y, rot=0.0, with_critter=True):
    k = townie(i, t0, t1, "worried")
    at(k, t0, x, y, rot, armL=(0, 4), armR=(0, 4))
    if with_critter:
        b = beast(f"cr{i}", (x + 1.0, y - 1.5, 0), 0.16, rot=rot + 20)
    return k


# ================================================================== SHOTS
@S(1, 0, 4, "HOOK: kid lies, smug face, push in")
def s01(t0, t1):
    town_scene()
    K = townie(3, t0, t1, "smug")
    at(K, t0, 3, -8, 10)
    lips(K, t0, t1)
    cam = Cam()
    cam.push(t0, t1, hd(3, -8), 7.5, 4.6, yaw=-8, pitch=2, lens=30)
    cam.handheld(0.8)
    sfx(t0 + 0.1, "whoosh", 0.6)


@S(2, 4, 9, "...crawls out of your mouth: critter climbs out")
def s02(t0, t1):
    town_scene()
    K = townie(3, t0, t1, "gasp")
    at(K, t0, 3, -8, 10)
    K.face(t0 + 0.2, "scream")
    cr = beast("crawl", (3.1, -8.9, 3.9), 0.14, rot=10)
    loc_key(cr["root"], t0, (3.1, -8.5, 3.9))
    loc_key(cr["root"], t0 + 0.9, (3.1, -9.3, 3.5))
    loc_key(cr["root"], t1, (3.4, -10.6, 0.0))
    cam = Cam()
    cam.push(t0, t1, (3, -9, 3.9), 5.2, 3.7, yaw=-14, pitch=3, lens=28)
    cam.crash(t0 + 0.5, 28, 40, 0.1)
    cam.handheld(1.0)
    sfx(t0 + 0.4, "pop")
    sfx(t0 + 0.8, "splat", 0.7)


@S(3, 9, 12, "...as a monster: a big one next to the kid")
def s03(t0, t1):
    town_scene()
    K = townie(3, t0, t1, "terror")
    at(K, t0, 2, -9, 10)
    K.act(t0 + 0.1, "recoil")
    B = beast("mon", (-3, -6, 0), 1.0, rot=-20)
    growl(B, t0 + 0.2, t1)
    cam = Cam()
    cam.push(t0, t1, (0, -8, 3.6), 14, 11, yaw=-18, pitch=3, lens=26)
    cam.crash(t0 + 0.1, 26, 34, 0.1)
    cam.handheld(1.0)
    sfx(t0 + 0.1, "zombie", 0.8)


@S(4, 12, 17, "Say 'I love your haircut' - two kids, the liar smiling")
def s04(t0, t1):
    town_scene()
    A = townie(5, t0, t1, "smile")
    at(A, t0, -2.2, -9, -25)
    B = townie(2, t0, t1, "grin", hair="messy")
    at(B, t0, 2.2, -9, 25)
    lips(B, t0 + 0.6, t1)
    A.act(t0 + 0.2, "hold")
    cam = Cam()
    cam.push(t0, t1, (0, -9, 4.3), 15, 12.5, yaw=-6, pitch=2, lens=26)
    cam.handheld(0.7)


@S(5, 17, 23, "...and a moth-sized creature bites you")
def s05(t0, t1):
    town_scene()
    B = townie(2, t0, t1, "smile")
    at(B, t0, 2, -9, 15)
    cr = beast("moth", (3.1, -9, 8.0), 0.08, rot=170)
    loc_key(cr["root"], t0, (3.1, -12.5, 7.5))
    loc_key(cr["root"], t0 + 0.9, (2.6, -10.0, 4.6))
    loc_key(cr["root"], t1, (2.6, -9.9, 4.4))
    jaw_open(cr, t0 + 1.0, 28)
    jaw_open(cr, t0 + 1.2, 2, 0.1)
    B.face(t0 + 1.1, "scream")
    B.act(t0 + 1.1, "hands_face")
    cam = Cam()
    cam.push(t0, t1, hd(2, -9), 6.0, 4.0, yaw=0, pitch=2, lens=28)
    cam.crash(t0 + 1.1, 28, 42, 0.1)
    cam.handheld(1.2)
    sfx(t0 + 1.0, "bonk")


@S(6, 23, 28, "Nobody lies for long here: townies with tiny critters")
def s06(t0, t1):
    town_scene()
    sad_townie(1, t0, t1, -6, -11, -10)
    sad_townie(4, t0, t1, 0, -12, 0)
    sad_townie(6, t0, t1, 6, -11, 10)
    cam = Cam()
    cam.push(t0, t1, (0, -11.5, 3.6), 16, 12.5, yaw=-4, pitch=3, lens=26)
    cam.handheld(0.7)
    sfx(t0, "crickets", 0.5)


@S(7, 28, 33, "You can't hide a monster: kid hides a big beast behind its back")
def s07(t0, t1):
    town_scene()
    K = townie(3, t0, t1, "worried")
    at(K, t0, 0, -9, 0, armL=(0, 4), armR=(0, 4))
    K.act(t0 + 0.3, "shrug")
    B = beast("hid", (0.8, -7.0, 0), 1.0, rot=0)
    for sx in (0,):
        loc_key(B["root"], t0, (0.8, -7.2, 0))
        loc_key(B["root"], t1, (0.8, -7.6, 0))
    growl(B, t0 + 0.4, t1)
    cam = Cam()
    cam.push(t0, t1, (0, -8, 4.0), 13, 10, yaw=-10, pitch=3, lens=26)
    cam.handheld(0.8)
    sfx(t0 + 0.2, "snort")


@S(8, 33, 36, "Except my dad: Dad steps into the living room, proud")
def s08(t0, t1):
    locs.living_room()
    Dd = dad(t0, t1, "smile")
    at(Dd, t0, 0, -4, 0)
    Dd.act(t0 + 0.2, "cross")
    cam = Cam()
    cam.push(t0, t1, hd(0, -4, 1.15), 10, 8, yaw=-12, pitch=2, lens=26)
    cam.handheld(0.6)
    sfx(t0 + 0.2, "ding", 0.6)


@S(9, 36, 41, "He has never had one: Dad with kids, nothing around him")
def s09(t0, t1):
    locs.living_room()
    Dd = dad(t0, t1, "smile")
    at(Dd, t0, 0, -3, 0)
    Dd.act(t0 + 0.3, "hold")
    M_ = mia(t0, t1, "smile")
    at(M_, t0, -4, -5, 20)
    cam = Cam()
    cam.orbit(t0, t1, hd(-1.5, -4, 1.0), 12, -18, 14, pitch=3, lens=26, fstop=8)
    cam.handheld(0.6)
    sfx(t0 + 1.5, "sparkle", 0.6)


@S(10, 41, 46, "People call him Honest Ben: banner + proud Dad")
def s10(t0, t1):
    town_scene(banner="honest_ben.png")
    Dd = dad(t0, t1, "grin")
    at(Dd, t0, 0, -9, 0)
    Dd.act(t0 + 0.2, "cheer")
    for i, x in enumerate((-5, 5)):
        k = townie(i + 8, t0, t1, "joy")
        at(k, t0, x, -10, 0)
        k.act(t0 + 0.4, "cheer")
    cam = Cam()
    cam.push(t0, t1, (0, -9, 4.4), 15, 11, yaw=-6, pitch=4, lens=26)
    cam.handheld(0.8)
    sfx(t0 + 0.3, "cheer", 0.7)


@S(11, 46, 51, "I'm Mia. I'm 11: Mia close-up, wave")
def s11(t0, t1):
    locs.living_room()
    M_ = mia(t0, t1, "happy")
    at(M_, t0, 0, -4, 0)
    M_.act(t0 + 0.2, "wave")
    lips(M_, t0, t1)
    cam = cu(t0, t1, (0, -4), 1.0, 7.5, 5.0, off=-8, lens=30)


@S(12, 51, 57, "and I have never heard him fib: Mia and Dad")
def s12(t0, t1):
    locs.living_room()
    Dd = dad(t0, t1, "smile")
    at(Dd, t0, 2.4, -4, -20)
    M_ = mia(t0, t1, "smile")
    at(M_, t0, -2.2, -4.5, 20)
    lips(M_, t0, t1)
    cam = Cam()
    cam.push(t0, t1, (0, -4, 4.2), 12, 9.0, yaw=-6, pitch=2, lens=28)
    cam.handheld(0.6)


@S(13, 57, 60, "Then one night: moon over the street")
def s13(t0, t1):
    night_street()
    cam = Cam()
    cam.key(t0, (0, -8, 2.5), (-2, 40, 12), lens=20)
    cam.key(t1, (0, -8, 4.0), (-2, 40, 18), lens=20)
    cam.handheld(0.5)
    sfx(t0, "wind", 0.6)


@S(14, 60, 65, "something started tearing through town: beast legs thundering")
def s14(t0, t1):
    night_street()
    B = beast("rampage", (-2, 100, 0), 5.0, rot=180)
    loc_key(B["root"], t0, (-2, 100, 0))
    loc_key(B["root"], t1, (-2, 22, 0))
    cam = Cam()
    cam.key(t0, (7, -16, 3.5), (-2, 45, 9), lens=20)
    cam.key(t1, (7, -16, 4.0), (-2, 38, 9), lens=20)
    cam.handheld(2.0)
    sfx(t0, "stomp")
    sfx(t0 + 1.0, "stomp")
    sfx(t0 + 2.0, "stomp")
    sfx(t0 + 0.2, "boom", 0.7)


@S(15, 65, 72, "It was the size of a barn: barn next to the beast")
def s15(t0, t1):
    night_world()
    c = collection("FIELD")
    box("fld", (160, 160, 0.4), (0, 30, -0.2), mat("fld", hexc("#27402f"), 0.95), 0, coll=c)
    barn_build((-10, 30), c)
    B = beast("big", (12, 30, 0), 4.0, rot=-8)
    growl(B, t0 + 0.4, t1, 0.6, 16)
    cam = Cam()
    cam.key(t0, (0, -30, 8), (0, 30, 7), lens=20)
    cam.key(t1, (0, -24, 8), (0, 30, 7.5), lens=20)
    cam.handheld(0.8)
    sfx(t0 + 1.2, "zombie", 0.7)


@S(16, 72, 78, "Sixty feet of fur and teeth: roaring head close-up")
def s16(t0, t1):
    night_world()
    B = beast("roar", (0, 14, 0), 5.0, rot=0)
    jaw_open(B, t0 + 0.6, 2)
    jaw_open(B, t0 + 1.4, 40, 0.3)
    jaw_open(B, t1 - 0.2, 40, 0.1)
    cam = Cam()
    cam.key(t0, (9, -26, 8), (0, 3, 15), lens=26)
    cam.key(t1, (4, -21, 10), (0, 3, 16), lens=26)
    cam.crash(t0 + 1.4, 24, 34, 0.1)
    cam.handheld(1.6)
    sfx(t0 + 1.3, "boom", 0.8)
    sfx(t0 + 1.3, "zombie", 0.9)


@S(17, 78, 82, "It flattened the bakery")
def s17(t0, t1):
    night_world()
    c = collection("BKST")
    box("bg", (160, 160, 0.4), (0, 30, -0.2), mat("bkg", hexc("#4a4a54"), 0.9), 0, coll=c)
    bk = bakery_build((0, 22), c)
    B = beast("stomp", (0, -6, 0), 3.2, rot=180)
    loc_key(B["root"], t0, (0, -10, 0))
    loc_key(B["root"], t0 + 1.0, (0, 13, 0))
    ts = t0 + 1.0
    bk.scale = (1, 1, 1)
    bk.keyframe_insert("scale", frame=F(ts - 0.04))
    bk.scale = (1.15, 1.15, 0.08)
    bk.keyframe_insert("scale", frame=F(ts + 0.1))
    W2.poof("dust", (0, 20, 3), ts, 4.0)
    cam = Cam()
    cam.key(t0, (-30, 2, 7), (0, 12, 5), lens=18)
    cam.key(t1, (-30, 6, 8), (0, 16, 4), lens=18)
    cam.crash(ts, 22, 30, 0.1)
    cam.handheld(1.8)
    sfx(ts, "boom")
    sfx(ts, "thud", 0.8)


@S(18, 82, 87, "It swallowed the mayor's car")
def s18(t0, t1):
    night_world()
    c = collection("CARST")
    box("cg", (160, 160, 0.4), (0, 30, -0.2), mat("cg", hexc("#3a3b44"), 0.9), 0, coll=c)
    car = W.car("mcar", (0, 8, 0), "#2a3a5a", rot=90)
    B = beast("eat", (0, -4, 0), 3.0, rot=180)
    loc_key(B["root"], t0, (0, -14, 0))
    loc_key(B["root"], t0 + 1.2, (0, 0.5, 0))
    jaw_open(B, t0 + 1.0, 45, 0.2)
    jaw_open(B, t0 + 1.8, 0, 0.1)
    tv = t0 + 1.8
    hide_ = [car] + list(car.children_recursive)
    for ob in hide_:
        sets.set_obj_visible(ob, tv - 1.0 / 30, True)
        sets.set_obj_visible(ob, tv, False)
    cam = Cam()
    cam.key(t0, (-26, -2, 6), (0, 3, 4), lens=18)
    cam.key(t1, (-24, 2, 6), (0, 5, 4), lens=18)
    cam.crash(tv, 22, 30, 0.1)
    cam.handheld(1.4)
    sfx(tv - 0.2, "snort", 0.8)
    sfx(tv, "thud")


@S(19, 87, 91, "At dawn, it vanished: empty wrecked street")
def s19(t0, t1):
    world((1.0, 0.62, 0.48), 0.9)
    light("dawn", "AREA", (-30, -20, 14), 5000, (1.0, 0.7, 0.45), 30, target=(0, 6, 1))
    c = collection("DAWN")
    box("dg", (200, 200, 0.4), (0, 40, -0.2), mat("dg", hexc("#6a6a72"), 0.9), 0, coll=c)
    claw_marks(-12, 12, 14, 6, c)
    for i in range(5):
        box(f"deb{i}", (1.4, 1.4, 0.8), (-8 + i * 4, 6 + (i % 2) * 5, 0.4), mat("deb", hexc("#8a6a4a"), 0.9), 0.1, coll=c,
            rot=(10 * i, 5, 30 * i))
    cam = Cam()
    cam.key(t0, (0, -8, 3), (0, 20, 3), lens=20)
    cam.key(t1, (0, -3, 3.2), (0, 20, 3), lens=20)
    cam.handheld(0.5)
    sfx(t0, "wind", 0.7)


@S(20, 91, 97, "Whose lie could be that big?: worried crowd")
def s20(t0, t1):
    town_scene()
    for i, (x, y, r) in enumerate([(-7, -11, -20), (-3, -13, -8), (2, -12, 6), (6.5, -10, 18), (0, -9, 0)]):
        k = townie(i + 1, t0, t1, "worried")
        at(k, t0, x, y, r)
        look_at(k, t0 + 0.5 + i * 0.2, ((i * 3) % 7 - 3, -14, 4.6))
        k.act(t0 + 0.3 + i * 0.1, "shrug")
    cam = Cam()
    cam.push(t0, t1, (0, -11, 3.8), 21, 16, yaw=-3, pitch=3, lens=26)
    cam.handheld(0.8)


@S(21, 97, 103, "Whoever owns that beast, confess now!")
def s21(t0, t1):
    town_scene()
    M_ = mayor(t0, t1, "angry")
    at(M_, t0, 0, -10, 0)
    M_.act(t0 + 0.2, "point")
    lips(M_, t0, t1, "shout")
    for i, x in enumerate((-5, 5)):
        k = townie(i + 12, t0, t1, "worried")
        at(k, t0, x, -14, 0)
    cam = Cam()
    cam.push(t0, t1, hd(0, -10), 10, 6.5, yaw=-8, pitch=3, lens=28)
    cam.handheld(1.0)
    sfx(t0 + 0.8, "buzzer", 0.5)


@S(22, 103, 106, "the mayor shouted: close-up shout")
def s22(t0, t1):
    town_scene()
    M_ = mayor(t0, t1, "furious")
    at(M_, t0, 0, -10, 0)
    lips(M_, t0, t1, "shout")
    M_.act(t0 + 0.1, "fists")
    cam = cu(t0, t1, (0, -10), 1.0, 5.5, 4.4, off=10, lens=32, hh=1.2)
    cam.crash(t0 + 0.1, 32, 44, 0.1)


@S(23, 106, 108, "Nobody spoke: silent crowd, pull out")
def s23(t0, t1):
    town_scene()
    for i, (x, y, r) in enumerate([(-6, -11, -15), (-2, -12, -5), (2, -12, 5), (6, -11, 15)]):
        k = townie(i + 3, t0, t1, "sus")
        at(k, t0, x, -11, r)
    cam = Cam()
    cam.push(t0, t1, (0, -12, 3.6), 11, 15, yaw=0, pitch=3, lens=26)
    sfx(t0, "crickets", 0.8)


@S(24, 108, 114, "So my brother Sam and I followed...")
def s24(t0, t1):
    night_street()
    M_ = mia(t0, t1, "determined")
    at(M_, t0, -2, 0, 180)
    M_.pose(t1, loc=(-2, 16, 0), rot=180)
    S_ = sam(t0, t1, "worried")
    at(S_, t0, 2, -1, 180)
    S_.pose(t1, loc=(2, 15, 0), rot=180)
    cam = Cam()
    cam.key(t0, (0, -12, 5), (0, 8, 4), lens=22)
    cam.key(t1, (0, 2, 5), (0, 24, 4), lens=22)
    cam.handheld(1.0)
    sfx(t0, "footsteps", 0.8)


@S(25, 114, 118, "the claw marks: gouges in the ground")
def s25(t0, t1):
    night_world()
    c = collection("CLAWS")
    box("cl_g", (120, 120, 0.4), (0, 30, -0.2), mat("cl_g", hexc("#74727a"), 0.95), 0, coll=c)
    claw_marks(-12, 12, 6, 7, c)
    cam = Cam()
    cam.key(t0, (-9, 0, 2.2), (-6, 6, 0.2), lens=26)
    cam.key(t1, (6, 0, 2.4), (9, 6, 0.2), lens=26)
    cam.handheld(1.0)


@S(26, 118, 124, "They stopped at our cellar door")
def s26(t0, t1):
    H = house_night()
    M_ = mia(t0, t1, "worried")
    at(M_, t0, -2, -6, 20)
    S_ = sam(t0, t1, "worried")
    at(S_, t0, 2, -6.5, -20)
    claw_marks(-6, 0, -4, 4, None)
    cam = Cam()
    cam.push(t0, t1, (0, -6, 3.8), 16, 11, yaw=-5, pitch=6, lens=26)
    cam.handheld(0.8)


@S(27, 124, 127, "We opened it: doors fly open, warm glow")
def s27(t0, t1):
    H = house_night()
    M_ = mia(t0, t1, "scared")
    at(M_, t0, -3.8, -6, 35)
    M_.act(t0 + 0.2, "reach")
    S_ = sam(t0, t1, "scared")
    at(S_, t0, 3.8, -6, -35)
    S_.act(t0 + 0.2, "reach")
    door_open(H, t0 + 0.3, 0.45)
    cam = Cam()
    cam.key(t0, (0, -17, 6), (0, 2, 1.8), lens=24)
    cam.key(t1, (0, -14, 5), (0, 2, 1.8), lens=24)
    cam.crash(t0 + 0.5, 26, 34, 0.1)
    cam.handheld(1.0)
    sfx(t0 + 0.3, "door")


@S(28, 127, 135, "Inside, curled around the furnace, was the monster")
def s28(t0, t1):
    cellar()
    B = beast("curl", (0, 6.5, 0), 1.6, rot=0)
    B["root"].rotation_euler[2] = math.radians(8)
    for e in B["eyes"]:
        e.scale = (1, 0.7, 0.06)
    cam = Cam()
    cam.key(t0, (-3, -14, 5.5), (0, 7, 3.5), lens=24)
    cam.key(t1, (0, -9, 5.0), (0, 7, 3.6), lens=24)
    cam.handheld(1.0)
    sfx(t0, "rise", 0.5)


@S(29, 135, 141, "And there was Dad, holding a bowl of food")
def s29(t0, t1):
    cellar()
    B = beast("curl", (3, 7, 0), 1.6, rot=-20)
    for e in B["eyes"]:
        e.scale = (1, 0.7, 0.06)
    Dd = dad(t0, t1, "smile")
    at(Dd, t0, -3.0, 2.2, -70, armR=(90, -10), armL=(90, 10))
    bw = bowl("bowl", Dd.coll)
    locs.hand_prop(Dd, "R", bw, (0, -0.6, -1.9), (0, 0, 0))
    cam = Cam()
    cam.push(t0, t1, (0, 4, 4.0), 13, 9.5, yaw=-12, pitch=5, lens=26)
    cam.handheld(0.7)


@S(30, 141, 148, "Hello, old friend: tender Dad close-up")
def s30(t0, t1):
    cellar()
    B = beast("curl", (3.2, 6.5, 0), 1.6, rot=-30)
    for e in B["eyes"]:
        e.scale = (1, 0.7, 0.06)
    Dd = dad(t0, t1, "smile")
    at(Dd, t0, -2.4, 2.6, -65)
    lips(Dd, t0 + 0.3, t1)
    cam = cu(t0, t1, (-2.4, 2.6), 1.15, 7.5, 5.8, rot=-65, off=-18, lens=30, hh=0.5)


@S(31, 148, 154, "He saw us and went pale: shock")
def s31(t0, t1):
    cellar()
    Dd = dad(t0, t1, "terror")
    at(Dd, t0, 0, 2.5, 0)
    Dd.act(t0 + 0.3, "recoil")
    cam = cu(t0, t1, (0, 2.5), 1.15, 6.5, 5.0, off=-6, lens=30, hh=1.4)
    cam.crash(t0 + 0.3, 30, 44, 0.1)
    sfx(t0 + 0.3, "gasp")


@S(32, 154, 158, "How long? I asked: Mia")
def s32(t0, t1):
    cellar()
    M_ = mia(t0, t1, "worried")
    at(M_, t0, 0, 1, 0)
    lips(M_, t0, t1)
    cam = cu(t0, t1, (0, 1), 1.0, 6.5, 4.8, off=-8, lens=30)


@S(33, 158, 162, "Nine years: Dad guilty")
def s33(t0, t1):
    cellar()
    Dd = dad(t0, t1, "worried")
    at(Dd, t0, 0, 2.5, 0)
    Dd.act(t0 + 0.2, "slump")
    lips(Dd, t0, t0 + 1.0)
    cam = cu(t0, t1, (0, 2.5), 1.15, 6.5, 5.2, off=8, lens=30, dz=-0.4)
    sfx(t0 + 0.1, "ding", 0.4)


@S(34, 162, 164, "Since Mom: Mia stricken")
def s34(t0, t1):
    cellar()
    M_ = mia(t0, t1, "cry")
    at(M_, t0, 0, 1, 0)
    cam = cu(t0, t1, (0, 1), 1.0, 5.5, 4.4, off=10, lens=32)


@S(35, 164, 170, "When people ask where she is...: Dad speaking")
def s35(t0, t1):
    cellar()
    Dd = dad(t0, t1, "worried")
    at(Dd, t0, 0, 2.5, 0)
    lips(Dd, t0, t1)
    cam = cu(t0, t1, (0, 2.5), 1.15, 7.0, 5.0, off=-12, lens=30)


@S(36, 170, 176, "I say she's traveling: the beast grows behind him")
def s36(t0, t1):
    cellar()
    B = beast("grow", (0, 8, 0), 1.5, rot=0)
    for e in B["eyes"]:
        e.scale = (1, 0.7, 0.06)
    scale_key(B["root"], t0, 1.5)
    scale_key(B["root"], t1, 2.0)
    Dd = dad(t0, t1, "worried")
    at(Dd, t0, -3.6, 0.5, 15)
    lips(Dd, t0, t1)
    cam = Cam()
    cam.push(t0, t1, (-0.6, 3, 4.8), 16, 14, yaw=-6, pitch=3, lens=26)
    cam.handheld(0.8)
    sfx(t0 + 1.5, "rise", 0.5)


@S(37, 176, 179, "And it grows: beast looms")
def s37(t0, t1):
    cellar()
    B = beast("grow", (0, 5, 0), 2.0, rot=0)
    scale_key(B["root"], t0, 2.0)
    scale_key(B["root"], t1, 2.4)
    for e in B["eyes"]:
        e.scale = (1, 0.7, 0.06)
    cam = Cam()
    cam.key(t0, (0, -13, 3), (0, 3, 7), lens=24)
    cam.key(t1, (0, -11, 2.5), (0, 3, 8.5), lens=24)
    cam.crash(t0 + 0.4, 24, 34, 0.1)
    cam.handheld(1.2)
    sfx(t0, "zombie", 0.8)


@S(38, 179, 182, "My throat burned: Mia hand at throat")
def s38(t0, t1):
    cellar()
    M_ = mia(t0, t1, "scared")
    at(M_, t0, 0, 1, 0)
    M_.act(t0 + 0.2, "hands_face", strength=0.7)
    cam = cu(t0, t1, (0, 1), 1.0, 5.2, 4.0, off=-8, lens=32)


@S(39, 182, 185, "Mom wasn't traveling: Mia tears")
def s39(t0, t1):
    cellar()
    M_ = mia(t0, t1, "cry")
    at(M_, t0, 0, 1, 0)
    M_.act(t0 + 0.2, "slump", strength=0.5)
    cam = cu(t0, t1, (0, 1), 1.0, 5.4, 4.2, off=12, lens=32)
    sfx(t0, "aww", 0.3)


@S(40, 185, 188, "Mom was gone: tight on Mia's face")
def s40(t0, t1):
    cellar()
    M_ = mia(t0, t1, "cry")
    at(M_, t0, 0, 1, 0)
    cam = cu(t0, t1, (0, 1), 1.0, 4.6, 3.8, off=-5, lens=34)


@S(41, 188, 191, "Dad, say it: Mia pleads")
def s41(t0, t1):
    cellar()
    M_ = mia(t0, t1, "worried")
    at(M_, t0, -2.6, 1, -50)
    lips(M_, t0, t1)
    Dd = dad(t0, t1, "worried")
    at(Dd, t0, 2.6, 2.4, 50)
    cam = Cam()
    cam.push(t0, t1, (-2.6, 1, 4.3), 8, 5.8, yaw=-60, pitch=2, lens=30)
    cam.handheld(0.8)


@S(42, 191, 193, "I can't: Dad breaks")
def s42(t0, t1):
    cellar()
    Dd = dad(t0, t1, "cry")
    at(Dd, t0, 0, 2.5, 0)
    Dd.act(t0 + 0.2, "facepalm", strength=0.6)
    cam = cu(t0, t1, (0, 2.5), 1.15, 5.8, 4.6, off=-10, lens=32)


@S(43, 193, 199, "The monster opened one yellow eye")
def s43(t0, t1):
    cellar()
    B = beast("eye", (0, 6.5, 0), 1.8, rot=0)
    e = B["eyes"][1]
    e.scale = (1, 0.7, 0.05)
    e.keyframe_insert("scale", frame=F(t0))
    e.scale = (1, 0.7, 0.05)
    e.keyframe_insert("scale", frame=F(t0 + 2.4))
    e.scale = (1.2, 0.9, 1.0)
    e.keyframe_insert("scale", frame=F(t0 + 3.2))
    B["eyes"][0].scale = (1, 0.7, 0.05)
    cam = Cam()
    cam.key(t0, (3.6, -7.0, 8.0), (1.0, 0.3, 7.3), lens=34)
    cam.key(t1, (2.8, -5.5, 7.8), (1.3, 0.3, 7.3), lens=38)
    cam.crash(t0 + 3.2, 36, 50, 0.1)
    cam.handheld(0.8)
    sfx(t0 + 3.0, "rise", 0.7)


@S(44, 199, 201, "Outside, sirens: red and blue light through the cellar door")
def s44(t0, t1):
    H = house_night()
    door_open(H, t0 - 1.0, 0.1)
    siren_lights(t0, t1 + 1.0, (0, -22, 6))
    cam = Cam()
    cam.key(t0, (0, -16, 3.0), (0, 3, 2.0), lens=24)
    cam.key(t1, (0, -13, 3.2), (0, 3, 2.0), lens=24)
    cam.handheld(1.0)
    sfx(t0, "alarm", 0.7)


@S(45, 201, 207, "The town was coming with torches")
def s45(t0, t1):
    night_world()
    c = collection("MOB")
    box("mg", (160, 160, 0.4), (0, 30, -0.2), mat("mg", hexc("#2a3a2c"), 0.95), 0, coll=c)
    folks = []
    for i, (x, y) in enumerate([(-8, 22), (-4, 26), (0, 20), (5, 25), (9, 21), (-1, 30)]):
        k = townie(i + 1, t0, t1, "angry")
        at(k, t0, x, y, 180)
        k.pose(t1, loc=(x, y - 20, 0), rot=180)
        tc = torch(f"torch{i}", k.coll)
        locs.hand_prop(k, "R", tc, (0, -0.6, -0.5), (0, 0, 0))
        k.act(t0, "hold")
    cam = Cam()
    cam.key(t0, (0, -2, 2.0), (0, 24, 5), lens=26)
    cam.key(t1, (0, -2, 2.6), (0, 14, 5), lens=26)
    cam.handheld(1.0)
    sfx(t0, "crowd", 0.8)


@S(46, 207, 210, "Please, I said: Mia begging")
def s46(t0, t1):
    cellar()
    M_ = mia(t0, t1, "cry")
    at(M_, t0, 0, 1, 0)
    M_.act(t0 + 0.1, "hold")
    lips(M_, t0, t1)
    cam = cu(t0, t1, (0, 1), 1.0, 5.4, 4.2, off=8, lens=32)


@S(47, 210, 215, "Dad knelt. His voice cracked")
def s47(t0, t1):
    cellar()
    B = beast("kneel", (5, 9, 0), 1.6, rot=-25)
    for e in B["eyes"]:
        e.scale = (1, 0.7, 0.5)
    Dd = dad(t0, t1, "worried")
    at(Dd, t0, -2.4, 1.5, -60)
    Dd.pose(t0 + 0.8, loc=(-2.4, 1.5, 0), rot=-60, hipz=-1.0, legL=(70, 3), legR=(70, -3))
    cam = Cam()
    cam.push(t0, t1, (0, 4, 3.6), 15, 12, yaw=-8, pitch=3, lens=26)
    cam.handheld(0.7)


@S(48, 215, 218, "Your mother died: Dad's tearful face")
def s48(t0, t1):
    cellar()
    Dd = dad(t0, t1, "cry")
    at(Dd, t0, 0, 2.5, 0)
    lips(Dd, t0, t1)
    cam = cu(t0, t1, (0, 2.5), 1.15, 5.4, 4.3, off=-6, lens=32, dz=-0.8, hh=0.3)
    sfx(t0 + 0.2, "aww", 0.4)


@S(49, 218, 221, "The monster shuddered")
def s49(t0, t1):
    cellar()
    B = beast("shud", (0, 6.5, 0), 1.8, rot=0)
    noise(B["root"], "rotation_euler", 1, 0.07, 2)
    noise(B["root"], "location", 2, 0.35, 3)
    cam = Cam()
    cam.key(t0, (0, -13, 5), (0, 4, 4.5), lens=24)
    cam.key(t1, (0, -11, 5), (0, 4, 4.5), lens=24)
    cam.handheld(0.6)
    sfx(t0, "zombie", 0.5)


@S(50, 221, 224, "It shrank")
def s50(t0, t1):
    cellar()
    B = beast("shr", (0, 6.5, 0), 1.8, rot=0)
    scale_key(B["root"], t0, 1.8)
    scale_key(B["root"], t1, 0.5)
    cam = Cam()
    cam.key(t0, (0, -5, 4), (0, 6, 3), lens=26)
    cam.key(t1, (0, -3.5, 2.5), (0, 6, 1.5), lens=26)
    cam.handheld(0.5)
    sfx(t0, "pop", 0.6)


@S(51, 224, 233, "It melted into smoke and drifted up like a sigh")
def s51(t0, t1):
    cellar()
    B = beast("melt", (0, 6.5, 0), 0.5, rot=0)
    scale_key(B["root"], t0, 0.5)
    scale_key(B["root"], t0 + 2.0, 0.02)
    for ob in [B["root"]] + list(B["root"].children_recursive):
        sets.set_obj_visible(ob, t0 + 2.0 - 1 / 30, True)
        sets.set_obj_visible(ob, t0 + 2.0, False)
    smoke_puffs("sm", (0, 6.5, 1.5), t0, t1 - 1.0, 10, 9.0)
    cam = Cam()
    cam.key(t0, (0, -4, 3), (0, 6.5, 2), lens=26)
    cam.key(t1, (0, -2, 5), (0, 6.5, 10), lens=26)
    cam.handheld(0.4)
    sfx(t0 + 1.0, "sparkle", 0.6)
    sfx(t0 + 2.0, "wind", 0.6)


@S(52, 233, 237, "Dad pulled us close")
def s52(t0, t1):
    cellar()
    Dd = dad(t0, t1, "cry")
    at(Dd, t0, 0, 2.5, 0)
    Dd.act(t0 + 0.2, "hold")
    M_ = mia(t0, t1, "cry")
    at(M_, t0, -3.5, 1.8, 40)
    M_.pose(t0 + 0.6, loc=(-1.9, 1.8, 0), rot=35)
    S_ = sam(t0, t1, "cry")
    at(S_, t0, 3.5, 1.8, -40)
    S_.pose(t0 + 0.6, loc=(1.9, 1.8, 0), rot=-35)
    cam = Cam()
    cam.push(t0, t1, (0, 2.2, 3.6), 11, 8.0, yaw=-3, pitch=3, lens=26)
    cam.handheld(0.6)


@S(53, 237, 244, "and we cried until the sirens faded")
def s53(t0, t1):
    cellar()
    Dd = dad(t0, t1, "cry")
    at(Dd, t0, 0, 2.5, 0, armL=(75, -20), armR=(75, -20))
    M_ = mia(t0, t1, "cry")
    at(M_, t0, -1.9, 1.8, 35, armL=(80, -10), armR=(80, -10))
    S_ = sam(t0, t1, "cry")
    at(S_, t0, 1.9, 1.8, -35, armL=(80, -10), armR=(80, -10))
    siren_lights(t0, t1 - 2.0, (0, -22, 6), 1800)
    cam = Cam()
    cam.key(t0, (0, -6, 4.2), (0, 2.5, 3.6), lens=26)
    cam.key(t1, (0, -11, 5), (0, 2.5, 3.2), lens=26)
    cam.handheld(0.4)
    sfx(t0, "alarm", 0.4)


@S(54, 244, 251, "Then he wiped his eyes and asked")
def s54(t0, t1):
    cellar()
    Dd = dad(t0, t1, "relief")
    at(Dd, t0, 0, 2.5, 0)
    Dd.act(t0 + 0.4, "facepalm", strength=0.5)
    lips(Dd, t0 + 3.0, t1)
    cam = cu(t0, t1, (0, 2.5), 1.15, 7.0, 5.2, off=-10, lens=30)


@S(55, 251, 255, "Are you two okay?: Dad smiling gently")
def s55(t0, t1):
    cellar()
    Dd = dad(t0, t1, "smile")
    at(Dd, t0, 0, 2.5, 0)
    lips(Dd, t0, t1)
    cam = cu(t0, t1, (0, 2.5), 1.15, 5.6, 4.6, off=10, lens=32)


@S(56, 255, 259, "I smiled. I'm fine: Mia's tight smile")
def s56(t0, t1):
    cellar()
    M_ = mia(t0, t1, "smile")
    at(M_, t0, 0, 1, 0)
    M_.face(t0 + 1.2, "smile")
    lips(M_, t0 + 1.5, t1)
    cam = cu(t0, t1, (0, 1), 1.0, 5.0, 3.8, off=-6, lens=34, hh=0.3)
    sfx(t0 + 1.6, "ding", 0.4)


@S(57, 259, 262, "Behind me,: over Mia's shoulder, dark corner")
def s57(t0, t1):
    cellar()
    M_ = mia(t0, t1, "smile")
    at(M_, t0, 0, 1, 180)
    cam = Cam()
    cam.key(t0, (0, -6.5, 4.8), (0, 6, 4.8), lens=28)
    cam.key(t1, (0, -5.0, 4.8), (0, 6, 4.8), lens=28)
    cam.handheld(0.4)
    sfx(t0, "crickets", 0.5)


@S(58, 262, None, "something huge opened its eyes: reveal")
def s58(t0, t1):
    cellar()
    M_ = mia(t0, t1, "smile")
    at(M_, t0, 0, 1, 180)
    B = beast("final", (0, 9, 0), 2.6, rot=0)
    for e in B["eyes"]:
        e.scale = (1, 0.7, 0.04)
        e.keyframe_insert("scale", frame=F(t0))
        e.scale = (1, 0.7, 0.04)
        e.keyframe_insert("scale", frame=F(t0 + 1.0))
        e.scale = (1.3, 0.95, 1.0)
        e.keyframe_insert("scale", frame=F(t0 + 1.6))
    cam = Cam()
    cam.key(t0, (0, -5, 4.6), (0, 6, 5), lens=26)
    cam.key(t1, (0, -3.5, 4.6), (0, 6, 6), lens=26)
    cam.crash(t0 + 1.6, 26, 40, 0.15)
    cam.handheld(0.8)
    sfx(t0 + 1.5, "boom", 0.9)
    sfx(t0 + 1.5, "zombie", 0.9)
