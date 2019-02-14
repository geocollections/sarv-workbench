<template>
    <div class="login row h-100 align-items-center text-center">

        <div class="col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-4 offset-lg-4">
            <b-tabs>

                <b-tab :title="$t('login.password')">
                    <div class="row mt-3 mb-3">
                        <div class="col">

                            <login-pass/>

                        </div>
                    </div>
                </b-tab>

                <b-tab :title="$t('login.idCard')">
                    <div class="row mt-3 mb-3">
                        <div class="col">

                            <login-id/>

                        </div>
                    </div>
                </b-tab>

            </b-tabs>

        </div>
    </div>
</template>

<script>
    import LoginPass from '@/components/login/LoginPass.vue'
    import LoginId from '@/components/login/LoginId.vue'

    export default {
        name: 'Login',
        components: {
            LoginPass,
            LoginId
        }
    }
</script>

<style>
    /* Overrides margin-left and right -15px from .row class */
    .login {
        margin-right: 0 !important;
        margin-left: 0 !important;
    }
</style>
