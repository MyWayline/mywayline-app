<script lang="ts">
    import { MoveLeft } from '@lucide/svelte';
    import { Button } from '#lib';
    import { Tabs } from '#lib';
    import { Input } from '#lib';
    import type { PageData } from './$types';
    import { goto } from '$app/navigation';
    import {
        loginSchema,
        registerSchema,
        type LoginInput,
        type RegisterInput,
    } from '#lib/schemas/auth.js';

    let { data }: { data: PageData } = $props();

    let currentTab = $derived(data.action);

    let loginValues = $state<LoginInput>({ email: '', password: '' });
    let loginTouched = $state<Partial<Record<keyof LoginInput, boolean>>>({});

    let registerValues = $state<RegisterInput>({
        email: '',
        password: '',
        confirmPassword: '',
    });
    let registerTouched = $state<Partial<Record<keyof RegisterInput, boolean>>>({});

    let loginValidation = $derived(loginSchema.safeParse(loginValues));
    let registerValidation = $derived(registerSchema.safeParse(registerValues));

    let loginErrors = $derived.by(() => {
        if (loginValidation.success) return {};

        const fieldErrors = loginValidation.error.flatten().fieldErrors;
        const mapped: Partial<Record<keyof LoginInput, string>> = {};

        for (const key of Object.keys(fieldErrors) as Array<keyof LoginInput>) {
            const value = loginValues[key];
            if (loginTouched[key] && value !== '' && fieldErrors[key]?.[0]) {
                mapped[key] = fieldErrors[key][0];
            }
        }

        return mapped;
    });

    let registerErrors = $derived.by(() => {
        if (registerValidation.success) return {};

        const fieldErrors = registerValidation.error.flatten().fieldErrors;
        const mapped: Partial<Record<keyof RegisterInput, string>> = {};

        for (const key of Object.keys(fieldErrors) as Array<keyof RegisterInput>) {
            const value = registerValues[key];
            if (registerTouched[key] && value !== '' && fieldErrors[key]?.[0]) {
                mapped[key] = fieldErrors[key][0];
            }
        }

        return mapped;
    });

    const handleLoginBlur = (field: keyof LoginInput) => {
        loginTouched[field] = true;
    };

    const handleRegisterBlur = (field: keyof RegisterInput) => {
        registerTouched[field] = true;
    };

    const handleLoginSubmit = (e: Event) => {
        e.preventDefault();
        if (loginValidation.success) {
            // Login to rust backend
        }
    };

    const handleRegisterSubmit = (e: Event) => {
        e.preventDefault();
        if (registerValidation.success) {
            // Register to rust backend
        }
    };
</script>

<div class="bg-bg-secondary h-full flex flex-col overflow-hidden" data-safe-area="bleed">
    <Button.Base>
        {#snippet child({ props })}
            <button
                class="group absolute -top-32.5 -left-30 h-65 w-65 rounded-full bg-bg-primary"
                onclick={() => goto('/auth')}
            >
                <div
                    class="absolute bottom-12.5 right-17.5 transition-[transform,background] duration-250 ease-out group-hover:-translate-x-1 group-active:scale-90"
                >
                    <MoveLeft size={32} strokeWidth={2} />
                </div>
            </button>
        {/snippet}
    </Button.Base>
    <div class="flex flex-col gap-2 pt-40 px-8 pb-12">
        <p class="text-xl font-light text-muted-foreground">
            {currentTab === 'login' ? 'Welcome back' : 'Welcome to Wayline'}
        </p>
        <h1 class="text-3xl font-semibold">
            {currentTab === 'login' ? "Let's Sign you in." : "Let's Sign you up."}
        </h1>
    </div>

    <div class="bg-bg-primary px-8 pt-8 rounded-t-[3rem] grow overflow-hidden">
        <Tabs.Root bind:value={currentTab} class="h-full min-h-full flex flex-col">
            <div class="pb-4">
                <Tabs.List>
                    <Tabs.Trigger value="login">Login</Tabs.Trigger>
                    <Tabs.Trigger value="register">Register</Tabs.Trigger>
                </Tabs.List>
            </div>
            <div class="min-h-0 overflow-y-auto p-2">
                <!-- LOGIN TAB -->
                <Tabs.Content value="login">
                    <form class="flex flex-col gap-6" onsubmit={handleLoginSubmit}>
                        <Input.Styled
                            variant="authinput"
                            type="email"
                            placeholder="email@example.com"
                            label="E-Mail"
                            error={loginErrors.email}
                            onblur={() => handleLoginBlur('email')}
                            bind:value={loginValues.email}
                            autocomplete="email"
                            required
                        />

                        <Input.Styled
                            variant="authinput"
                            type="password"
                            placeholder="Password"
                            label="Password"
                            minlength={8}
                            maxlength={255}
                            error={loginErrors.password}
                            onblur={() => handleLoginBlur('password')}
                            bind:value={loginValues.password}
                            autocomplete="current-password"
                            required
                        />

                        <Button.Root
                            class="mt-2"
                            style="height: 50px"
                            type="submit"
                            disabled={!loginValidation.success}
                        >
                            Login
                        </Button.Root>
                    </form>
                </Tabs.Content>

                <!-- REGISTER TAB -->
                <Tabs.Content value="register">
                    <form class="flex flex-col gap-6" onsubmit={handleRegisterSubmit}>
                        <Input.Styled
                            variant="authinput"
                            id="email"
                            name="email"
                            label="Email"
                            type="email"
                            placeholder="email@example.com"
                            autocomplete="email"
                            error={registerErrors.email}
                            onblur={() => handleRegisterBlur('email')}
                            bind:value={registerValues.email}
                            required
                        />

                        <Input.Styled
                            variant="authinput"
                            id="password"
                            name="password"
                            label="Password"
                            type="password"
                            placeholder="Enter your password"
                            autocomplete="new-password"
                            error={registerErrors.password}
                            onblur={() => handleRegisterBlur('password')}
                            bind:value={registerValues.password}
                            passwordIndicator
                            minlength={8}
                            required
                        />

                        <Input.Styled
                            variant="authinput"
                            id="confirm-password"
                            name="confirm-password"
                            label="Confirm Password"
                            type="password"
                            placeholder="Confirm your password"
                            error={registerErrors.confirmPassword}
                            onblur={() => handleRegisterBlur('confirmPassword')}
                            bind:value={registerValues.confirmPassword}
                            minlength={8}
                            required
                        />

                        <Button.Root
                            class="mt-2"
                            style="height: 50px"
                            type="submit"
                            disabled={!registerValidation.success}
                        >
                            Signup
                        </Button.Root>
                    </form>
                </Tabs.Content>
            </div>
        </Tabs.Root>
    </div>
</div>
