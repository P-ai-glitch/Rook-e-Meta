// Raw opening data. Add new openings here.
export const OPENINGS = {
white: [
{n:"Italian Game",eco:"C50",m:"1.e4 e5 2.Nf3 Nc6 3.Bc4",c:"mixed",fen:"r1bqkbnr/pppp1ppp/2n5/4p3/2B1P3/5N2/PPPP1PPP/RNBQK2R",d:"Develop quickly and aim the bishop at f7. Can be a slow build-up or a sharp attack.",i:"Central control, then d3 or c3-d4."},
{n:"Ruy Lopez",eco:"C60",m:"1.e4 e5 2.Nf3 Nc6 3.Bb5",c:"mixed",fen:"r1bqkbnr/pppp1ppp/2n5/1B2p3/4P3/5N2/PPPP1PPP/RNBQK2R",d:"Pressure the knight that guards e5 and build a lasting central edge.",i:"Long-term pressure and manoeuvring."},
{n:"Queen's Gambit",eco:"D06",m:"1.d4 d5 2.c4",c:"offensive",fen:"rnbqkbnr/ppp1pppp/8/3p4/2PP4/8/PP2PPPP/RNBQKBNR",d:"Offer a wing pawn to win the centre and gain space and activity.",i:"Challenge d5, claim the centre."},
{n:"London System",eco:"D02",m:"1.d4 d5 2.Bf4 Nf6 3.e3",c:"defensive",fen:"rnbqkb1r/ppp1pppp/5n2/3p4/3P1B2/4P3/PPP2PPP/RN1QKBNR",d:"A solid, low-theory setup with the bishop developed before e3.",i:"Sturdy pyramid: pawns d4, e3, c3."},
{n:"English Opening",eco:"A10",m:"1.c4",c:"mixed",fen:"rnbqkbnr/pppppppp/8/8/2P5/8/PP1PPPPP/RNBQKBNR",d:"A flexible flank start that fights for d5 and can transpose widely.",i:"Control d5 from the wing."},
{n:"Réti Opening",eco:"A09",m:"1.Nf3 d5 2.c4",c:"mixed",fen:"rnbqkbnr/ppp1pppp/8/3p4/2P5/5N2/PP1PPPPP/RNBQKB1R",d:"A hypermodern approach: pressure the centre from a distance.",i:"Fianchetto and undermine d5."},
{n:"King's Gambit",eco:"C30",m:"1.e4 e5 2.f4",c:"offensive",fen:"rnbqkbnr/pppp1ppp/8/4p3/4PP2/8/PPPP2PP/RNBQKBNR",d:"A romantic pawn sacrifice to open the f-file and attack quickly.",i:"Initiative over material."},
{n:"Scotch Game",eco:"C45",m:"1.e4 e5 2.Nf3 Nc6 3.d4 exd4 4.Nxd4",c:"offensive",fen:"r1bqkbnr/pppp1ppp/2n5/8/3NP3/8/PPP2PPP/RNBQKB1R",d:"Open the centre at once for active pieces and clear plans.",i:"Space and quick piece activity."},
{n:"Vienna Game",eco:"C25",m:"1.e4 e5 2.Nc3",c:"mixed",fen:"rnbqkbnr/pppp1ppp/8/4p3/4P3/2N5/PPPP1PPP/R1BQKBNR",d:"Support e4 and keep f4 in reserve. Solid or sharp on demand.",i:"Delay commitment, then strike with f4."},
{n:"Catalan Opening",eco:"E00",m:"1.d4 Nf6 2.c4 e6 3.g3 d5",c:"mixed",fen:"rnbqkb1r/ppp2ppp/4pn2/3p4/2PP4/6P1/PP2PP1P/RNBQKBNR",d:"A bishop on the long diagonal keeps quiet but persistent pressure.",i:"Pressure on d5 and the queenside."}],
black: [
{n:"Sicilian Najdorf",eco:"B90",m:"1.e4 c5 2.Nf3 d6 3.d4 cxd4 4.Nxd4 Nf6 5.Nc3 a6",c:"offensive",fen:"rnbqkb1r/1p2pppp/p2p1n2/8/3NP3/2N5/PPP2PPP/R1BQKB1R",d:"Fight for the initiative with an unbalanced, counterattacking structure.",i:"Queenside play, ...e5 or ...b5."},
{n:"French Defence",eco:"C00",m:"1.e4 e6 2.d4 d5",c:"defensive",fen:"rnbqkbnr/ppp2ppp/4p3/3p4/3PP3/8/PPP2PPP/RNBQKBNR",d:"A resilient pawn chain that challenges the centre from a safe base.",i:"Undermine d4 with ...c5."},
{n:"Caro-Kann",eco:"B10",m:"1.e4 c6 2.d4 d5",c:"defensive",fen:"rnbqkbnr/pp2pppp/2p5/3p4/3PP3/8/PPP2PPP/RNBQKBNR",d:"Rock-solid structure with a healthy pawn setup and an easy bishop.",i:"Solidity, then ...Bf5."},
{n:"King's Indian",eco:"E60",m:"1.d4 Nf6 2.c4 g6 3.Nc3 Bg7 4.e4 d6",c:"mixed",fen:"rnbqk2r/ppp1ppbp/3p1np1/8/2PPP3/2N5/PP3PPP/R1BQKBNR",d:"Let White take space, then strike back in the centre or on the kingside.",i:"Hypermodern counterplay with ...e5."},
{n:"Nimzo-Indian",eco:"E20",m:"1.d4 Nf6 2.c4 e6 3.Nc3 Bb4",c:"mixed",fen:"rnbqk2r/pppp1ppp/4pn2/8/1bPP4/2N5/PP2PPPP/R1BQKBNR",d:"Pin the knight to control e4 and shape White's structure.",i:"Control e4, doubled pawns, piece play."},
{n:"Slav Defence",eco:"D10",m:"1.d4 d5 2.c4 c6",c:"defensive",fen:"rnbqkbnr/pp2pppp/2p5/3p4/2PP4/8/PP2PPPP/RNBQKBNR",d:"Hold d5 firmly while keeping the light-squared bishop free.",i:"Solid centre, bishop out first."},
{n:"Scandinavian",eco:"B01",m:"1.e4 d5 2.exd5 Qxd5",c:"mixed",fen:"rnb1kbnr/ppp1pppp/8/3q4/8/8/PPPP1PPP/RNBQKBNR",d:"Challenge e4 immediately for a simple structure and quick development.",i:"Early queen, fast development."},
{n:"Pirc Defence",eco:"B07",m:"1.e4 d6 2.d4 Nf6 3.Nc3 g6",c:"mixed",fen:"rnbqkb1r/ppp1pp1p/3p1np1/8/3PP3/2N5/PPP2PPP/R1BQKBNR",d:"Allow a big centre, then attack it with pieces and pawn breaks.",i:"Flexible; ...c5 or ...e5 breaks."},
{n:"Dutch Defence",eco:"A80",m:"1.d4 f5",c:"offensive",fen:"rnbqkbnr/ppppp1pp/8/5p2/3P4/8/PPP1PPPP/RNBQKBNR",d:"Grab control of e4 immediately and play for a kingside attack.",i:"Fight for e4, attack on the wing."},
{n:"Grünfeld Defence",eco:"D80",m:"1.d4 Nf6 2.c4 g6 3.Nc3 d5",c:"offensive",fen:"rnbqkb1r/ppp1pp1p/5np1/3p4/2PP4/2N5/PP2PPPP/R1BQKBNR",d:"Invite a broad centre, then attack it with sharp piece pressure.",i:"Dynamic counter-strike on d4."}]
};
export const CATS = {
 defensive:{label:"Defensive",color:"var(--blue)",icon:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/>'},
 offensive:{label:"Offensive",color:"var(--red)",icon:'<path d="m11 19-6-6M5 21l-2-2M8 16l-4 4M9.5 17.5 21 6V3h-3L6.5 14.5"/>'},
 mixed:{label:"Mixed",color:"var(--orange)",icon:'<path d="M3 8h18M17 4l4 4-4 4M21 16H3M7 12l-4 4 4 4"/>'}
};
