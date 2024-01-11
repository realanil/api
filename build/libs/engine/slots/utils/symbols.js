"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Symbols = void 0;
class Symbols {
    static UniqueWinningSymbols(wins) {
        const offsets = new Set();
        wins.forEach(win => {
            win.offsets.forEach(offset => {
                offsets.add(offset);
            });
        });
        return Array.from(offsets);
    }
    static WinningReelsByOffsets(offsets, layout) {
        const winsPerReel = [];
        for (let i = 0; i < layout.length; i++) {
            winsPerReel[i] = 0;
        }
        offsets.forEach((offset) => {
            const col = offset % layout.length;
            winsPerReel[col] += 1;
        });
        const winreels = [];
        for (let i = 0; i < layout.length; i++) {
            winreels[i] = winsPerReel[i] == layout[i];
        }
        return winreels;
    }
}
exports.Symbols = Symbols;
