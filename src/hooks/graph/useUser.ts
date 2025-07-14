import { useMsal } from '@azure/msal-react'
import { loginRequest } from '@/graph/authConfig'
import useUiStore from '@/store/useUiStore'
import { AccountInfo } from '@azure/msal-browser'

const useUser = () => {
  const { instance, accounts, inProgress } = useMsal()
  const currentAccount = useUiStore(state => state.currentAccount)

  const account: AccountInfo | null = accounts[currentAccount] || null

  // Đăng nhập
  const login = () => {
    if (inProgress === "none") {
      instance.loginRedirect(loginRequest)
    }
  }
  // Đăng xuất
  const logout = (account: AccountInfo) => {
    instance.logoutRedirect({
      account: account,
      postLogoutRedirectUri: '/',
    })
  }

  return { accounts, account, login, logout }
}

export default useUser