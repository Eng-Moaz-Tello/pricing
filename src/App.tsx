import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import Layout from './components/layout/Layout'
import ProjectsPage from './pages/ProjectsPage'
import ProjectEditorPage from './pages/ProjectEditorPage'
import IncomingEntitiesPage from './pages/IncomingEntitiesPage'
import ContractorsPage from './pages/ContractorsPage'
import ItemsPage from './pages/ItemsPage'
import RelatedWorksPage from './pages/RelatedWorksPage'
import QuickProjectPage from './pages/QuickProjectPage'
export default function App() {
  return (
    <HashRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<Navigate to="/projects" replace />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/projects/new" element={<ProjectEditorPage />} />
          <Route path="/projects/:id" element={<ProjectEditorPage />} />
          <Route path="/incoming-entities" element={<IncomingEntitiesPage />} />
          <Route path="/contractors" element={<ContractorsPage />} />
          <Route path="/items" element={<ItemsPage />} />
          <Route path="/related-works" element={<RelatedWorksPage />} />
          <Route path="/projects/quick" element={<QuickProjectPage />} />
        </Route>
      </Routes>
    </HashRouter>
  )
}