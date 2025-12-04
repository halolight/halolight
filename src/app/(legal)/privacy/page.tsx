import { Metadata } from "next"

export const metadata: Metadata = {
  title: "隐私政策 | Admin Pro",
  description: "Admin Pro 隐私政策",
}

export default function PrivacyPage() {
  return (
    <article className="prose prose-slate dark:prose-invert max-w-none">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">隐私政策</h1>
      <p className="text-muted-foreground">最后更新日期：2024年1月1日</p>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">1. 引言</h2>
        <p className="text-muted-foreground leading-relaxed">
          欢迎使用 Admin Pro（以下简称&ldquo;本服务&rdquo;或&ldquo;我们&rdquo;）。我们非常重视您的隐私和个人信息保护。
          本隐私政策将向您说明我们如何收集、使用、存储和保护您的个人信息，
          以及您享有的相关权利。请您在使用本服务前仔细阅读本政策。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">2. 信息收集</h2>
        <p className="text-muted-foreground leading-relaxed">我们可能收集以下类型的信息：</p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>
            <strong>账户信息：</strong>
            当您注册账户时，我们会收集您的姓名、电子邮件地址、密码等基本信息。
          </li>
          <li>
            <strong>使用数据：</strong>
            我们会自动收集您使用服务的相关数据，包括访问时间、浏览页面、点击操作等。
          </li>
          <li>
            <strong>设备信息：</strong>
            我们可能收集您的设备类型、操作系统、浏览器类型、IP地址等技术信息。
          </li>
          <li>
            <strong>Cookie 和类似技术：</strong>
            我们使用 Cookie 和类似技术来提升用户体验和分析服务使用情况。
          </li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">3. 信息使用</h2>
        <p className="text-muted-foreground leading-relaxed">我们收集的信息将用于以下目的：</p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>提供、维护和改进我们的服务</li>
          <li>处理您的请求和交易</li>
          <li>发送服务相关的通知和更新</li>
          <li>分析服务使用情况以优化用户体验</li>
          <li>检测和防止欺诈或其他非法活动</li>
          <li>遵守法律法规要求</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">4. 信息共享</h2>
        <p className="text-muted-foreground leading-relaxed">
          我们不会出售您的个人信息。我们仅在以下情况下共享您的信息：
        </p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>经您明确同意</li>
          <li>与为我们提供服务的合作伙伴共享（受保密协议约束）</li>
          <li>为遵守法律要求或响应合法的政府请求</li>
          <li>为保护我们、用户或公众的权利、财产或安全</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">5. 信息安全</h2>
        <p className="text-muted-foreground leading-relaxed">
          我们采取行业标准的安全措施来保护您的个人信息，包括但不限于：
        </p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>使用 SSL/TLS 加密传输数据</li>
          <li>对敏感信息进行加密存储</li>
          <li>实施访问控制和身份验证机制</li>
          <li>定期进行安全审计和漏洞扫描</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">6. 您的权利</h2>
        <p className="text-muted-foreground leading-relaxed">根据适用法律，您享有以下权利：</p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>访问您的个人信息</li>
          <li>更正不准确的信息</li>
          <li>删除您的个人信息</li>
          <li>限制或反对信息处理</li>
          <li>数据可携带性</li>
          <li>撤回同意</li>
        </ul>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">7. Cookie 政策</h2>
        <p className="text-muted-foreground leading-relaxed">
          我们使用 Cookie 和类似技术来：
        </p>
        <ul className="list-disc pl-6 text-muted-foreground space-y-2">
          <li>记住您的登录状态和偏好设置</li>
          <li>分析网站流量和用户行为</li>
          <li>提供个性化的内容和广告</li>
        </ul>
        <p className="text-muted-foreground leading-relaxed mt-4">
          您可以通过浏览器设置管理 Cookie 偏好。请注意，禁用某些 Cookie 可能会影响网站功能。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">8. 儿童隐私</h2>
        <p className="text-muted-foreground leading-relaxed">
          本服务不面向 18 岁以下的未成年人。我们不会故意收集儿童的个人信息。
          如果您是家长或监护人，发现您的孩子向我们提供了个人信息，请联系我们。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">9. 政策更新</h2>
        <p className="text-muted-foreground leading-relaxed">
          我们可能会不时更新本隐私政策。更新后的政策将在本页面发布，
          重大变更时我们会通过电子邮件或网站通知您。请定期查看本政策以了解最新信息。
        </p>
      </section>

      <section className="mt-8">
        <h2 className="text-xl font-semibold text-foreground">10. 联系我们</h2>
        <p className="text-muted-foreground leading-relaxed">
          如果您对本隐私政策有任何疑问或建议，请通过以下方式联系我们：
        </p>
        <ul className="list-none pl-0 text-muted-foreground space-y-2 mt-4">
          <li>电子邮件：privacy@halolight.h7ml.cn</li>
          <li>地址：中国北京市</li>
        </ul>
      </section>
    </article>
  )
}
