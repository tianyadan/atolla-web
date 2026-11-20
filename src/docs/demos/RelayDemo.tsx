import { useState } from 'react'
import { DemoFrame, PlayButton, Seg } from './shared'
import { useInView, useStepper, useZh } from './hooks'

type Route = 'relay' | 'lan'

const STEPS = {
  relay: [
    { zh: '手机发送任务，中继校验设备会话后写入指令信箱', en: 'Phone sends a task; relay checks the device session and queues it', cmd: 'pending', seg: 'p2r' },
    { zh: '电脑出站长轮询（约 25 秒挂起）领取指令', en: 'Computer long-polls outbound (~25 s) and leases it', cmd: 'leased', seg: 'm2r' },
    { zh: '电脑在本机执行：同一套队列、引擎与权限网关', en: 'Runs locally with the same queue, engine and gateway', cmd: 'leased', seg: 'mac' },
    { zh: '电脑推送镜像与结果，指令标记完成', en: 'Computer pushes mirrors and the result; command done', cmd: 'done', seg: 'm2r' },
    { zh: '手机按消息 ID 幂等合并，时间线更新', en: 'Phone merges idempotently by message ID', cmd: 'done', seg: 'r2p' },
  ],
  lan: [
    { zh: '手机通过 Bonjour 或二维码找到同一网络里的电脑', en: 'Phone finds the computer via Bonjour or QR code', cmd: '', seg: 'lan' },
    { zh: '每个请求带设备 ID、时间戳、nonce 与 HMAC 签名', en: 'Every request carries device ID, timestamp, nonce and HMAC', cmd: '', seg: 'lan' },
    { zh: '电脑验签、拒绝重放，然后在本机执行', en: 'Computer verifies, rejects replays, runs locally', cmd: '', seg: 'mac' },
    { zh: '局域网不可达时自动回退到云端中继', en: 'Falls back to the cloud relay when LAN is unreachable', cmd: '', seg: 'lan' },
  ],
} as const

export default function RelayDemo() {
  const zh = useZh()
  const [route, setRoute] = useState<Route>('relay')
  const [online, setOnline] = useState(true)
  const [playing, setPlaying] = useState(true)
  const [ref, inView] = useInView<HTMLDivElement>()
  const steps = STEPS[route]
  const [step, setStep] = useStepper(steps.length, 1900, playing && inView)
  const s = Math.min(step, steps.length - 1)
  // 离线：指令停在 pending，手机读缓存镜像
  const stalled = route === 'relay' && !online && s >= 1
  const cur = stalled ? steps[0] : steps[s]
  const seg = stalled ? 'none' : cur.seg

  return (
    <DemoFrame
      title={zh ? '电脑 ⇄ 自托管中继 ⇄ 手机' : 'Computer ⇄ self-hosted relay ⇄ phone'}
      controls={
        <>
          <Seg
            label={zh ? '连接方式' : 'Route'}
            value={route}
            onChange={(v) => { setRoute(v); setStep(0) }}
            options={[
              { value: 'relay', label: zh ? '云端中继' : 'Cloud relay' },
              { value: 'lan', label: zh ? '局域网直连 Beta' : 'LAN Beta' },
            ]}
          />
          <label className="dm-check">
            <input type="checkbox" checked={online} onChange={() => setOnline((o) => !o)} />
            {zh ? '电脑在线' : 'Computer online'}
          </label>
          <PlayButton playing={playing} onToggle={() => setPlaying((p) => !p)} />
        </>
      }
      caption={
        zh
          ? '服务器永不主动连接你的电脑：所有指令都由电脑出站拉取。中继只保存按实例分片的缓存镜像与指令信箱，真相始终在你的电脑上。'
          : 'The relay never dials into your computer: every command is pulled outbound. It only keeps per-instance cache mirrors and a mailbox; the truth stays on your machine.'
      }
    >
      <div className="rl" ref={ref}>
        <div className={`rl-stage rl-stage--${route} ${online ? '' : 'is-offline'}`}>
          <div className={`rl-dev rl-dev--mac ${seg === 'mac' ? 'is-hot' : ''}`}>
            <div className="rl-mac" aria-hidden="true">
              <div className="rl-mac__screen">
                <span className="rl-bar" /><span className="rl-bar rl-bar--s" /><span className="rl-bar" />
              </div>
              <div className="rl-mac__base" />
            </div>
            <strong>{zh ? '你的电脑' : 'Your computer'}</strong>
            <small>{online ? (route === 'lan' ? 'LAN Relay · /lan/v1' : 'RemoteBridge') : zh ? '离线' : 'Offline'}</small>
          </div>

          <div className={`rl-wire rl-wire--a ${seg === 'm2r' ? 'is-on' : ''} ${route === 'lan' ? 'is-muted' : ''}`} aria-hidden="true">
            <span className={`rl-packet ${s === 3 ? 'is-rev' : ''}`} />
            <em>{zh ? '出站长轮询' : 'outbound long-poll'}</em>
          </div>

          <div className={`rl-dev rl-dev--relay ${route === 'lan' ? 'is-muted' : ''}`}>
            <div className="rl-server" aria-hidden="true"><i /><i /><i /></div>
            <strong>{zh ? '你的服务器' : 'Your server'}</strong>
            <small>remote-relay · :3080</small>
            {route === 'relay' && (
              <span className={`rl-cmd rl-cmd--${stalled ? 'pending' : cur.cmd}`}>
                commands · {stalled ? 'pending' : cur.cmd}
              </span>
            )}
          </div>

          <div className={`rl-wire rl-wire--b ${seg === 'p2r' || seg === 'r2p' ? 'is-on' : ''} ${route === 'lan' ? 'is-muted' : ''}`} aria-hidden="true">
            <span className={`rl-packet ${seg === 'p2r' ? 'is-rev' : ''}`} />
            <em>HTTP(S)</em>
          </div>

          <div className="rl-dev rl-dev--phone">
            <div className="rl-phone" aria-hidden="true">
              <span className="rl-phone__island" />
              <span className="rl-bar" /><span className="rl-bar rl-bar--s" />
            </div>
            <strong>iPhone</strong>
            <small>{stalled ? (zh ? '显示缓存镜像 · 离线' : 'cached mirror · offline') : zh ? '设备会话' : 'device session'}</small>
          </div>

          {route === 'lan' && (
            <div className={`rl-lan ${seg === 'lan' ? 'is-on' : ''}`} aria-hidden="true">
              <span className="rl-packet" />
              <em>{zh ? '同一局域网 · HMAC 签名' : 'same LAN · HMAC signed'}</em>
            </div>
          )}
        </div>

        <ol className="rl-steps">
          {steps.map((x, i) => (
            <li key={x.zh} className={i === s && !stalled ? 'is-on' : i < s && !stalled ? 'is-done' : stalled && i === 0 ? 'is-on' : ''}>
              <button type="button" onClick={() => { setStep(i); setPlaying(false) }}>
                <span>{i + 1}</span>
                {zh ? x.zh : x.en}
              </button>
            </li>
          ))}
        </ol>
        {stalled && (
          <p className="rl-note rl-note--warn">
            {zh ? '电脑离线：指令留在信箱里等待实例上线后再执行，手机明确提示离线，不会切换到其他电脑。' : 'Offline: the command waits in the mailbox until the instance returns; the phone shows “offline” and never switches to another computer.'}
          </p>
        )}
        {route === 'lan' && (
          <p className="rl-note">
            {zh ? '局域网直连使用 HTTP + 签名认证，内容不加密，仅适合可信网络。' : 'LAN mode uses HTTP with signed requests; content is not encrypted, so use trusted networks only.'}
          </p>
        )}
      </div>
    </DemoFrame>
  )
}
