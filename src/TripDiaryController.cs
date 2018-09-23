using Microsoft.AspNetCore.Mvc;
namespace TRAISI.Extensions.TripDiary
{
    public class TripDiaryController : Controller
    {

        private readonly TripDiaryService _tripDiaryService;

        public TripDiaryController(TripDiaryService tripDiaryService)
        {
            this._tripDiaryService = tripDiaryService;
        }
        
    }
}