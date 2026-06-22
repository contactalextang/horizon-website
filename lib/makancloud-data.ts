/**
 * 膳云 MakanCloud 展示页的结构化数据（中英双语）。
 * 事实来源：scripts/content-engine/knowledge/makancloud-facts.md +
 * 膳云/packages/auth/src/plans.ts。产品有重大变化时同步更新这里。
 */
export type Locale = 'en' | 'zh'

interface Bi {
  en: string
  zh: string
}

const t = (en: string, zh: string): Bi => ({ en, zh })

export const makanHero = {
  kicker: t('Singapore F&B operations SaaS', '新加坡餐饮全链路运营 SaaS'),
  title: t('One system for ordering, kitchen, delivery and POS.', '一套系统接住订货、厨房、配送和 POS。'),
  subtitle: t(
    'From outlet ordering to central-kitchen production, dispatch and front-counter checkout — MakanCloud puts the operations that break most often into one platform.',
    '从门店厨师长下单到中央厨房生产、出库配送和前台收银，膳云把每天最容易出错的运营流程放进同一个平台。',
  ),
  badges: [
    t('14-day Pro free trial', '14 天 Pro 免费试用'),
    t('No credit card', '无需信用卡'),
    t('5-minute setup', '5 分钟配置完成'),
    t('TLS encrypted', 'TLS 加密传输'),
  ],
}

export const valueProps = [
  {
    title: t('Reliable', '可靠'),
    body: t(
      'Daily 2am auto-backup kept 14 days, security audit every sprint with zero cross-tenant leakage, offline POS with idempotent sync.',
      '每日凌晨 2:00 自动备份保留 14 天，每个迭代做安全审计、零跨租户泄露，POS 断网可离线收银且幂等同步。',
    ),
  },
  {
    title: t('Simple', '简单易用'),
    body: t('Up and running in 5 minutes; bilingual 中文/English one-tap switch; built to be run by the owner.', '5 分钟配置上手；中英双语一键切换；老板自己也能运维。'),
  },
  {
    title: t('Customizable', '定制化'),
    body: t('Multi-tenant white-label: your brand color, GST, receipts and custom domain. Deep customization available.', '多租户白标：品牌色、GST、收据、自定义域名全可配；支持深度定制。'),
  },
  {
    title: t('Efficient', '高效'),
    body: t('Ordering → kitchen → sorting → dispatch → delivery in one flow; OR-Tools auto-generates the monthly roster.', '订货→厨房→分拣→出库→配送一条流；OR-Tools 自动生成月度排班。'),
  },
  {
    title: t('Affordable', '价格实惠'),
    body: t('From SGD 59/month, 14-day free trial. Runs lean, so pricing stays low.', 'SGD 59/月起，14 天免费试用；底层成本低，定价才低。'),
  },
]

export const features = [
  { name: t('Outlet → central-kitchen ordering', '门店→中央厨房订货'), pain: t('No more WeChat/paper-note chaos, oversell, or mismatched accounts.', '告别微信/纸单混乱、超卖、对不上账。') },
  { name: t('Central kitchen, end to end', '中央厨房全链路'), pain: t('Purchasing, receiving, BOM recipes, production, sorting and cold-chain dispatch with full traceability.', '采购、入库、配方、生产、分拣、冷链出库，全程可追溯。') },
  { name: t('Delivery dispatch', '配送调度'), pain: t('One-click tasks from outbound orders, full status flow, driver app and proof of delivery.', '出库单一键建任务，全状态流转，司机 App + 签收凭证。') },
  { name: t('Smart scheduling (OR-Tools)', '智能排班（OR-Tools）'), pain: t('Compliant monthly rosters generated automatically; two-step leave/swap approval.', '自动生成合规月度班表；请假/换班两阶段审批。') },
  { name: t('POS / checkout', 'POS / 收银'), pain: t('Counter + table modes, integrated with back-of-house inventory; offline checkout.', '柜台+桌台双模式，与后端库存打通；可离线收银。') },
  { name: t('QR self-ordering', '扫码点餐'), pain: t('Per-table QR, pay-first, auto to KDS and station printing — fewer queues and missed orders.', '每桌 QR、先付款、自动进 KDS 与工位打印——少排队、少漏单。') },
  { name: t('Multi-tenant white-label', '多租户白标'), pain: t('Run the whole system under your own brand and domain.', '整套系统按你的品牌与域名跑。') },
  { name: t('Bilingual 中文/English', '中英双语'), pain: t('One-tap UI switch; print tickets always bilingual for mixed teams.', '界面一键切换；打印件固定双语，方便多语种员工。') },
]

export const pricing = [
  { name: 'Starter', price: 59, outlets: t('1 outlet', '1 门店'), terminals: t('2 POS terminals', '2 个 POS 终端'), extra: t('Basic reports, standard support', '基础报表、标准支持') },
  { name: 'Pro', price: 129, outlets: t('5 outlets', '5 门店'), terminals: t('10 POS terminals', '10 个 POS 终端'), extra: t('Advanced reports, scheduling, priority support', '高级报表、排班、优先支持'), featured: true },
  { name: 'Growth', price: 199, outlets: t('15 outlets', '15 门店'), terminals: t('30 POS terminals', '30 个 POS 终端'), extra: t('Full reports, dedicated support', '全功能报表、专属客服') },
  { name: 'Enterprise', price: 299, outlets: t('Unlimited outlets', '无限门店'), terminals: t('Unlimited terminals', '无限终端'), extra: t('Dedicated implementation team', '专属实施团队') },
]

export const faq = [
  {
    q: t('Who is MakanCloud for?', '膳云适合谁？'),
    a: t(
      'Singapore restaurant chains and growing F&B teams, especially those with a central kitchen and multiple outlets who want ordering, kitchen, delivery and checkout on one platform.',
      '新加坡连锁餐饮与成长型餐饮团队，尤其是有中央厨房+多门店、想把订货/厨房/配送/收银统一到一个平台的品牌。',
    ),
  },
  {
    q: t('How much does it cost?', '多少钱？'),
    a: t(
      'From SGD 59/month (Starter); Pro 129, Growth 199, Enterprise 299. 14-day Pro free trial, no credit card required.',
      'SGD 59/月起（Starter）；Pro 129、Growth 199、Enterprise 299。14 天 Pro 免费试用，无需信用卡。',
    ),
  },
  {
    q: t('How is it different from a traditional POS?', '和传统 POS 有什么不同？'),
    a: t(
      'The POS is integrated with back-of-house ordering, inventory, central kitchen and delivery — not a standalone register. It also supports QR self-ordering and offline checkout.',
      '膳云的 POS 与后端订货、库存、中央厨房、配送打通，不是孤立的收银机；还支持扫码自助点餐和断网离线收银。',
    ),
  },
  {
    q: t('Does it work when the network is unstable?', '网络不稳能用吗？'),
    a: t('Yes. The POS supports offline checkout and syncs automatically without duplicate charges when the network returns.', '能。POS 支持离线收银，恢复网络后自动同步且防重复扣账。'),
  },
  {
    q: t('Can I use my own brand?', '能用我自己的品牌吗？'),
    a: t('Yes. Multi-tenant white-label lets you set brand color, receipts and a custom domain, with deep customization available.', '能。多租户白标，可配置品牌色、收据、自定义域名，并支持深度定制。'),
  },
  {
    q: t('Is the data safe?', '数据安全吗？'),
    a: t('Row-level tenant isolation, daily backups kept 14 days, TLS encryption, and a security audit every sprint.', '行级租户隔离、每日备份保留 14 天、TLS 加密，且每个迭代做安全审计。'),
  },
]

export function pick(b: Bi, locale: Locale): string {
  return b[locale]
}
