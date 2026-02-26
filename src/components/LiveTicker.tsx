import { motion } from 'framer-motion'

const N = {
    bgCard: '#080f1e',
    border: 'rgba(0,255,245,0.12)',
    textMid: '#7ec8d4',
    pink: '#ff2d78',
    orange: '#ff6b00',
    cyan: '#00fff5',
}

const TICKER_ITEMS = [
    { type: 'CRITICAL', text: 'Level 4 Cyclone forming off the coast of Odisha', color: N.pink },
    { type: 'WARNING', text: 'Heavy rainfall expected in Assam over next 48 hours', color: N.orange },
    { type: 'INFO', text: 'Evacuation centers in Bihar operating at 60% capacity', color: N.cyan },
    { type: 'CRITICAL', text: 'Flash flood alert issued for 5 districts in Maharashtra', color: N.pink },
]

export function LiveTicker() {
    return (
        <div style={{
            background: N.bgCard,
            borderBottom: `1px solid ${N.border}`,
            padding: '4px 0',
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'center',
            fontSize: 11,
            letterSpacing: 1,
            fontFamily: 'Orbitron, monospace'
        }}>
            <div style={{
                background: N.pink,
                color: '#fff',
                padding: '2px 8px',
                fontWeight: 900,
                zIndex: 10,
                marginRight: 10,
                boxShadow: `0 0 10px ${N.pink}`,
                borderRight: `2px solid #000`
            }}>
                LIVE
            </div>

            <div style={{ flex: 1, overflow: 'hidden', position: 'relative', display: 'flex' }}>
                <div className="animate-ticker">
                    {TICKER_ITEMS.map((item, i) => (
                        <span key={i} style={{ marginRight: 60, color: N.textMid }}>
                            <span style={{ color: item.color, fontWeight: 700, textShadow: `0 0 5px ${item.color}` }}>
                                ⬤ {item.type}:
                            </span> {item.text}
                        </span>
                    ))}
                    {/* Duplicate for seamless looping */}
                    {TICKER_ITEMS.map((item, i) => (
                        <span key={`dup-${i}`} style={{ marginRight: 60, color: N.textMid }}>
                            <span style={{ color: item.color, fontWeight: 700, textShadow: `0 0 5px ${item.color}` }}>
                                ⬤ {item.type}:
                            </span> {item.text}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    )
}
