import { ReactNode } from 'react'
import { useLocation, Navigate } from 'react-router-dom'

// contexts
import useAuthStore from '../contexts/useAuthStore'

const RequireAuth = ({ children }: { children: Array<ReactNode> | ReactNode }) => {
    return children;
    const accessToken = useAuthStore(async state => await state.getToken);
    const location = useLocation();

    if (!accessToken) {
        return <Navigate to="/login" state={{ from: location }} replace={true} />
    }

    return <>{children}</>
}

export default RequireAuth;