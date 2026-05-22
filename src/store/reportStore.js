import { create } from 'zustand'

const useReportStore = create((set) => ({
  report: {
    title: '',
    sections: [],
  },

  addSection: () =>
    set((state) => ({
      report: {
        ...state.report,
        sections: [
          ...state.report.sections,
          {
            id: Date.now(),
            title: 'New Section',
            components: [],
          },
        ],
      },
    })),

  addComponent: (sectionId, component) =>
    set((state) => ({
      report: {
        ...state.report,
        sections: state.report.sections.map((section) => {
          if (section.id === sectionId) {
            return {
              ...section,
              components: [...section.components, component],
            }
          }

          return section
        }),
      },
    })),
}))

export default useReportStore