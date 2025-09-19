src/
├─ config/
│ ├─ configuration.ts
│ └─ validation.ts
├─ core/
│ ├─ application/
│ │ ├─ dto/
│ │ │ ├─ auth/
│ │ │ │ ├─ auth.dto.ts
│ │ │ │ ├─ login.dto.ts
│ │ │ │ ├─ oauth.dto.ts
│ │ │ │ ├─ refresh.dto.ts
│ │ │ │ ├─ register.dto.ts
│ │ │ │ └─ tokens.dto.ts
│ │ │ ├─ communication/
│ │ │ │ ├─ email/
│ │ │ │ ├─ notification/
│ │ │ │ └─ sms/
│ │ │ ├─ security/
│ │ │ │ ├─ 2fa/
│ │ │ │ │ ├─ setup-2fa.dto.ts
│ │ │ │ │ └─ verify-2fa.dto.ts
│ │ │ │ └─ password/
│ │ │ │ ├─ change-password.dto.ts
│ │ │ │ ├─ forgot-password.dto.ts
│ │ │ │ └─ reset-password.dto.ts
│ │ │ └─ user/
│ │ │ ├─ create-user.dto.ts
│ │ │ └─ user.dto.ts
│ │ ├─ mappers/
│ │ │ ├─ oauth.mapper.ts
│ │ │ └─ user.mapper.ts
│ │ └─ use-cases/
│ │ ├─ auth/
│ │ │ ├─ login-with-oauth.use-case.ts
│ │ │ ├─ login.use-case.ts
│ │ │ ├─ magic-link-request.use-case.ts
│ │ │ ├─ magic-link-verify.use-case.ts
│ │ │ ├─ refresh-token.use-case.ts
│ │ │ ├─ register.use-case.ts
│ │ │ ├─ revoke-token.use-case.ts
│ │ │ ├─ webauthn-authenticate.use-case.ts
│ │ │ └─ webauthn-register.use-case.ts
│ │ ├─ oauth/
│ │ │ ├─ login-with-external-provider.use-case.ts
│ │ │ └─ login-with-saml.use-case.ts
│ │ ├─ security/
│ │ │ ├─ 2fa/
│ │ │ │ ├─ disable-2fa.use-case.ts
│ │ │ │ ├─ totp-setup.use-case.ts
│ │ │ │ └─ totp-verify.use-case.ts
│ │ │ ├─ password/
│ │ │ │ ├─ change-password.use-case.ts
│ │ │ │ ├─ forgot-password.use-case.ts
│ │ │ │ └─ reset-password.use-case.ts
│ │ │ └─ sessions/
│ │ │ ├─ list-sessions.use-case.ts
│ │ │ └─ revoke-session.use-case.ts
│ │ └─ user/
│ │ ├─ create-user.use-case.ts
│ │ ├─ delete-user.use-case.ts
│ │ ├─ get-user.use-case.ts
│ │ └─ update-user.use-case.ts
│ └─ domain/
│ ├─ entities/
│ │ ├─ session.entity.ts
│ │ ├─ token.entity.ts
│ │ └─ user.entity.ts
│ ├─ repositories/
│ │ ├─ session.repository.ts
│ │ ├─ token.repository.ts
│ │ └─ user.repository.ts
│ ├─ services/
│ │ └─ password-policy.service.ts
│ └─ value-objects/
│ └─ email.vo.ts
├─ infrastructure/
│ ├─ adapters/
│ │ ├─ email/
│ │ │ └─ templates/
│ │ │ ├─ magic-link.template.hbs
│ │ │ ├─ password-reset.template.hbs
│ │ │ └─ welcome.template.hbs
│ │ └─ oauth/
│ │ └─ oauth.session.adapter.ts
│ ├─ auth/
│ │ ├─ strategies/
│ │ │ ├─ facebook.strategy.ts
│ │ │ └─ google.strategy.ts
│ │ └─ jwt.strategy.ts
│ ├─ cache/
│ │ ├─ rate-limit/
│ │ │ └─ login-rate-limiter.service.ts
│ │ └─ redis.client.ts
│ ├─ db/
│ │ ├─ entities/
│ │ │ └─ user.orm-entity.ts
│ │ ├─ migrations/
│ │ ├─ prisma/
│ │ │ ├─ prisma.service.ts
│ │ │ └─ user.repository.impl.ts
│ │ └─ typeorm/
│ │ ├─ audit-log.repository.impl.ts
│ │ ├─ session.repository.impl.ts
│ │ ├─ token.repository.impl.ts
│ │ └─ user.repository.impl.ts
│ ├─ email/
│ │ ├─ templates/
│ │ └─ email.client.ts
│ ├─ oauth/
│ │ ├─ facebook.adapter.ts
│ │ ├─ github.adapter.ts
│ │ ├─ google.adapter.ts
│ │ ├─ oidc.adapter.ts
│ │ └─ saml.adapter.ts
│ ├─ providers/
│ ├─ security/
│ │ ├─ bcrypt.service.ts
│ │ ├─ hmac-hash.service.ts
│ │ └─ jwt.service.ts
│ ├─ sms/
│ │ └─ sms.client.ts
│ └─ webauthn/
│ └─ webauthn.adapter.ts
├─ interfaces/
│ ├─ graphql/
│ └─ http/
│ ├─ auth/
│ │ ├─ guards/
│ │ │ ├─ jwt-auth.guard.ts
│ │ │ ├─ permissions.guard.ts
│ │ │ ├─ refresh-token.guard.ts
│ │ │ └─ roles.guard.ts
│ │ ├─ auth.controller.ts
│ │ ├─ auth.module.ts
│ │ └─ auth.service.ts
│ ├─ communication/
│ │ ├─ email/
│ │ ├─ notification/
│ │ └─ sms/
│ ├─ oauth/
│ │ ├─ oauth.controller.ts
│ │ └─ oauth.service.ts
│ ├─ security/
│ │ ├─ 2fa/
│ │ │ ├─ 2fa.controller.ts
│ │ │ └─ 2fa.service.ts
│ │ ├─ password/
│ │ │ ├─ password.controller.ts
│ │ │ └─ password.service.ts
│ │ ├─ session/
│ │ │ ├─ session.controller.ts
│ │ │ └─ session.service.ts
│ │ └─ token/
│ │ ├─ token.controller.ts
│ │ └─ token.service.ts
│ └─ user/
│ ├─ user.controller.ts
│ └─ user.module.ts
├─ scripts/
│ └─ account-seed.ts
├─ shared/
│ ├─ decorators/
│ │ └─ roles.decorator.ts
│ ├─ exceptions/
│ │ └─ not-found.exception.ts
│ ├─ filters/
│ │ └─ global-exception.filter.ts
│ ├─ interceptors/
│ │ └─ response.interceptor.ts
│ ├─ pipes/
│ └─ utils/
│ ├─ validators/
│ ├─ api-response.ts
│ ├─ hash-token.ts
│ ├─ response.helper.ts
│ └─ time.util.ts
├─ app.module.ts
└─ main.ts
